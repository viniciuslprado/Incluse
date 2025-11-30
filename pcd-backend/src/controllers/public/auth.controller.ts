import { Request, Response } from "express";
import { EmpresasRepo } from "../../repositories/empresa/empresas.repo";
import { CandidatosRepo } from "../../repositories/candidato/candidatos.repo";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prismaClient';
import { randomBytes } from 'crypto';
import { sendPasswordResetEmail } from '../../services/common/email.service';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { identifier, senha, userType } = req.body ?? {};
      if (!identifier || !senha || !userType) {
        return res.status(400).json({ error: 'identifier, senha e userType são obrigatórios' });
      }

      const isEmail = String(identifier).includes('@');
      let user: any = null;
      let role = userType;

      if (userType === 'empresa') {
        console.log('[AuthController] Login empresa - identifier recebido:', identifier);
        if (isEmail) {
          user = await EmpresasRepo.findByCnpj(identifier) // fallback
          user = await EmpresasRepo.findByEmail?.(identifier) ?? user;
        } else {
          const only = String(identifier).replace(/\D/g, '');
          user = await EmpresasRepo.findByCnpj(only) ?? await EmpresasRepo.findByCnpj(identifier);
        }
        console.log('[AuthController] Empresa encontrada:', user);
      } else if (userType === 'candidato' || userType === 'admin') {
        if (isEmail) {
          if (userType === 'candidato') {
            user = await CandidatosRepo.findByEmail(identifier);
          } else {
            user = await prisma.administrador.findUnique({ where: { email: identifier } });
          }
        } else {
          const only = String(identifier).replace(/\D/g, '');
          if (userType === 'candidato') {
            user = await CandidatosRepo.findByCpf(only) ?? await CandidatosRepo.findByCpf(identifier);
          } else {
            // Admin só pode logar por email, não faz sentido buscar por outro identificador
            user = null;
          }
        }
        role = userType;
      } else {
        // outros: tenta email em candidatos/empresas
        if (isEmail) {
          user = await CandidatosRepo.findByEmail(identifier) ?? await EmpresasRepo.findByEmail?.(identifier);
        }
      }

      if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });


      const senhaHash = (user as any).senhaHash;
      console.log('[AuthController] senhaHash encontrado:', senhaHash);
      if (!senhaHash) return res.status(401).json({ error: 'Usuário sem senha cadastrada' });

      const ok = bcrypt.compareSync(senha, senhaHash);
      console.log('[AuthController] senha recebida:', senha, '| senhaHash:', senhaHash, '| ok:', ok);
      if (!ok) return res.status(401).json({ error: 'Senha inválida' });


      // Reativar conta se estiver desativada
      if (userType === 'candidato' && user.isActive === false) {
        await prisma.candidato.update({ where: { id: user.id }, data: { isActive: true } });
      } else if (userType === 'empresa' && user.isActive === false) {
        await prisma.empresa.update({ where: { id: user.id }, data: { isActive: true } });
      }

      // Notificação de boas-vindas no primeiro login do candidato
      if (userType === 'candidato') {
        const notificacoes = await prisma.notificacao.findMany({
          where: { candidatoId: user.id, tipo: 'boas_vindas' }
        });
        if (notificacoes.length === 0) {
          await prisma.notificacao.create({
            data: {
              candidatoId: user.id,
              tipo: 'boas_vindas',
              titulo: 'Bem-vindo ao Incluse!',
              mensagem: 'Sua jornada de inclusão começa agora. Explore vagas, atualize seu perfil e aproveite todas as oportunidades!'
            }
          });
        }
      }

      const token = jwt.sign({ sub: user.id, role, name: user.nome || user.nomeContato || user.nome }, JWT_SECRET, { expiresIn: '15m' });

      // Cria refresh token (dias configuráveis)
      const refreshDays = Number(process.env.REFRESH_TOKEN_EXP_DAYS || '30');
      const refreshToken = randomBytes(32).toString('hex');
      const refreshExpiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);
      await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, userType: role ?? userType, expiresAt: refreshExpiresAt } });

      // Sempre retorna o campo 'id' no objeto user
      const responseObj = {
        token,
        refreshToken,
        user: {
          id: user.id ?? null,
          nome: user.nome ?? user.nomeContato ?? null,
          email: user.email ?? null
        },
        userType
      };
      console.log('[AuthController] Login response:', JSON.stringify(responseObj, null, 2));
      res.json(responseObj);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? 'Erro ao autenticar' });
    }
  }
,

  // POST /auth/forgot { identifier }
  async forgot(req: Request, res: Response) {
    try {
      const { identifier } = req.body ?? {};
      if (!identifier) return res.status(400).json({ error: 'identifier é obrigatório' });
      const isEmail = String(identifier).includes('@');

      // find user (candidato or empresa)
      let user: any = null;
      let userType: 'candidato' | 'empresa' | null = null;
      if (isEmail) {
        user = await CandidatosRepo.findByEmail(identifier) ?? await EmpresasRepo.findByEmail?.(identifier);
        if (user && (await CandidatosRepo.findByEmail(identifier))) userType = 'candidato';
        else if (user) userType = 'empresa';
      } else {
        const only = String(identifier).replace(/\D/g, '');
        const c = await CandidatosRepo.findByCpf(only) ?? await CandidatosRepo.findByCpf(identifier);
        if (c) { user = c; userType = 'candidato'; }
        else {
          const e = await EmpresasRepo.findByCnpj(only) ?? await EmpresasRepo.findByCnpj(identifier);
          if (e) { user = e; userType = 'empresa'; }
        }
      }

      if (!user) {
        // Do not reveal existence - respond success (to avoid account enumeration)
        return res.json({ ok: true });
      }

      // Gera token e envia por e-mail, mas não persiste (ajuste: não há tabela passwordReset)
      const token = randomBytes(24).toString('hex');
      // Log token para dev
      console.log(`[AuthController] password reset token for ${userType} ${user.id}: ${token}`);
      console.log(`[AuthController] reset link: ${process.env.APP_BASE_URL || 'http://localhost:5173'}/recuperar-senha?token=${token}&tipo=${userType}`);
      const targetEmail = user.email;
      if (targetEmail) {
        try {
          await sendPasswordResetEmail({ to: targetEmail, token, userType: userType ?? 'candidato' });
        } catch (mailErr) {
          console.error('[AuthController] erro ao enviar email de reset:', mailErr);
        }
      }
      // Retorna token apenas para dev/teste (não seguro em produção)
      return res.json({ ok: true, token } );
    } catch (e: any) {
      console.error('[AuthController] forgot error', e);
      return res.status(500).json({ error: e.message ?? 'Erro ao processar recuperação' });
    }
  },

  // POST /auth/reset { token, senha }
  async reset(req: Request, res: Response) {
    try {
      const { token, senha } = req.body ?? {};
      if (!token || !senha) return res.status(400).json({ error: 'token e senha são obrigatórios' });
      if (typeof senha !== 'string' || senha.length < 6) return res.status(400).json({ error: 'Senha inválida (mínimo 6 caracteres)' });

      // Não há persistência de token, então apenas simula reset (apenas para dev/teste)
      // O ideal seria validar o token recebido de outra forma (ex: JWT ou cache temporário)
      // Aqui, apenas retorna sucesso para fluxo de teste
      return res.json({ ok: true, info: 'Reset de senha simulado. Implemente persistência/token seguro para produção.' });
    } catch (e: any) {
      console.error('[AuthController] reset error', e);
      return res.status(500).json({ error: e.message ?? 'Erro ao redefinir senha' });
    }
  }
  ,
  // POST /auth/refresh { refreshToken }
  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body ?? {};
      if (!refreshToken) return res.status(400).json({ error: 'refreshToken é obrigatório' });
      const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      if (!stored) return res.status(401).json({ error: 'Refresh token inválido' });
      // Não há revokedAt no modelo, então não verifica
      if (new Date() > stored.expiresAt) {
        await prisma.refreshToken.delete({ where: { id: stored.id } });
        return res.status(401).json({ error: 'Refresh token expirado' });
      }

      // Recupera usuário (candidato ou empresa) para emitir novo access token
      let user: any = null;
      if (stored.userType === 'candidato') {
        user = await CandidatosRepo.findById(stored.userId);
      } else if (stored.userType === 'empresa') {
        user = await EmpresasRepo.findById?.(stored.userId);
      }
      if (!user) return res.status(401).json({ error: 'Usuário associado ao refresh não encontrado' });

      const newAccess = jwt.sign({ sub: user.id, role: stored.userType, name: user.nome || user.nomeContato || user.nome }, JWT_SECRET, { expiresIn: '15m' });
      // Rotaciona refresh (em vez de reutilizar)
      const newRefresh = randomBytes(32).toString('hex');
      const refreshDays = Number(process.env.REFRESH_TOKEN_EXP_DAYS || '30');
      const newRefreshExpiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);
      // Marca antigo revogado e cria novo
      // Não há revokedAt no modelo, então apenas deleta o antigo
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      await prisma.refreshToken.create({ data: { token: newRefresh, userId: stored.userId, userType: stored.userType, expiresAt: newRefreshExpiresAt } });
      return res.json({ token: newAccess, refreshToken: newRefresh });
    } catch (e: any) {
      console.error('[AuthController] refresh error', e);
      return res.status(500).json({ error: e.message ?? 'Erro ao gerar novo token' });
    }
  },

  // DEV ONLY: POST /auth/dev-token { candidatoId }
  async devToken(req: Request, res: Response) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }
    try {
      const { candidatoId } = req.body ?? {};
      if (!candidatoId) return res.status(400).json({ error: 'candidatoId é obrigatório' });
      
      const user = await CandidatosRepo.findById(Number(candidatoId));
      if (!user) return res.status(404).json({ error: 'Candidato não encontrado' });
      
      const token = jwt.sign({ sub: user.id, role: 'candidato', name: user.nome }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ token, user: { id: user.id, nome: user.nome, email: user.email }, userType: 'candidato' });
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? 'Erro ao gerar token de desenvolvimento' });
    }
  },

  // PUT /auth/change-password { userId, userType, senhaAtual, novaSenha }
  async changePassword(req: Request, res: Response) {
    try {
      const { userId, userType, senhaAtual, novaSenha } = req.body ?? {};
      if (!userId || !userType || !senhaAtual || !novaSenha) {
        return res.status(400).json({ error: 'userId, userType, senhaAtual e novaSenha são obrigatórios' });
      }
      if (typeof novaSenha !== 'string' || novaSenha.length < 6) {
        return res.status(400).json({ error: 'Nova senha inválida (mínimo 6 caracteres)' });
      }

      let user: any = null;
      if (userType === 'candidato') {
        user = await CandidatosRepo.findById(Number(userId));
      } else if (userType === 'empresa') {
        user = await EmpresasRepo.findById?.(Number(userId));
      }

      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

      const senhaHash = (user as any).senhaHash;
      if (!senhaHash) return res.status(401).json({ error: 'Usuário sem senha cadastrada' });

      const ok = bcrypt.compareSync(senhaAtual, senhaHash);
      if (!ok) return res.status(401).json({ error: 'Senha atual inválida' });

      const novaSenhaHash = (bcrypt as any).hashSync(novaSenha, 8);
      if (userType === 'candidato') {
        await prisma.candidato.update({ where: { id: Number(userId) }, data: { senhaHash: novaSenhaHash } });
      } else {
        await prisma.empresa.update({ where: { id: Number(userId) }, data: { senhaHash: novaSenhaHash } });
      }

      return res.json({ ok: true });
    } catch (e: any) {
      console.error('[AuthController] changePassword error', e);
      return res.status(500).json({ error: e.message ?? 'Erro ao alterar senha' });
    }
  }
};
