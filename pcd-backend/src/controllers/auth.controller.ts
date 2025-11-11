import { Request, Response } from "express";
import { EmpresasRepo } from "../repositories/empresas.repo";
import { CandidatosRepo } from "../repositories/candidatos.repo";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

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
        if (isEmail) {
          user = await EmpresasRepo.findByCnpj(identifier) // fallback
          // find by email
          user = await EmpresasRepo.findByEmail?.(identifier) ?? user;
        } else {
          const only = String(identifier).replace(/\D/g, '');
          user = await EmpresasRepo.findByCnpj(only) ?? await EmpresasRepo.findByCnpj(identifier);
        }
      } else if (userType === 'candidato') {
        if (isEmail) {
          user = await CandidatosRepo.findByEmail(identifier);
        } else {
          const only = String(identifier).replace(/\D/g, '');
          user = await CandidatosRepo.findByCpf(only) ?? await CandidatosRepo.findByCpf(identifier);
        }
      } else {
        // administrador and others: try email on empresas/candidatos
        if (isEmail) {
          user = await CandidatosRepo.findByEmail(identifier) ?? await EmpresasRepo.findByEmail?.(identifier);
        }
      }

      if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

      const senhaHash = (user as any).senhaHash;
      if (!senhaHash) return res.status(401).json({ error: 'Usuário sem senha cadastrada' });

      const ok = bcrypt.compareSync(senha, senhaHash);
      if (!ok) return res.status(401).json({ error: 'Senha inválida' });

      const token = jwt.sign({ sub: user.id, role, name: user.nome || user.nomeContato || user.nome }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ token, user: { id: user.id, nome: user.nome ?? user.nomeContato, email: user.email }, userType });
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? 'Erro ao autenticar' });
    }
  }
};
