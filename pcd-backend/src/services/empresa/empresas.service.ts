import { EmpresasRepo } from "../../repositories/empresa/empresas.repo";
import bcrypt from 'bcryptjs';
import { sendNotificationEmail } from "../common/email.service";

export const EmpresasService = {
  async criarEmpresa(
    nome: string,
    cnpj?: string,
    email?: string,
    senha?: string,
    telefone?: string,
    endereco?: string,
    areaAtuacao?: string,
    descricao?: string,
    logoUrl?: string
  ) {
    if (!nome?.trim()) throw new Error("Nome é obrigatório");
    if (cnpj) {
      const cnpjNorm = cnpj.replace(/\D/g, '');
      if (cnpjNorm.length !== 14) throw new Error("CNPJ inválido");
      const existe = await EmpresasRepo.findByCnpj(cnpjNorm);
      if (existe) throw new Error("CNPJ já cadastrado");
    }
    if (email) {
      const emailNorm = email.trim().toLowerCase();
      const existe = await EmpresasRepo.findByEmail(emailNorm);
      if (existe) throw new Error("E-mail já cadastrado");
    }
    const senhaHash = senha ? bcrypt.hashSync(senha, 8) : undefined;
    const empresa = await EmpresasRepo.create(
      nome.trim(),
      cnpj?.replace(/\D/g, ''),
      email?.trim().toLowerCase(),
      senhaHash,
      telefone,
      endereco,
      areaAtuacao,
      descricao,
      logoUrl
    );

    // Enviar e-mail de boas-vindas se houver e-mail
    if (empresa?.email) {
      await sendNotificationEmail({
        to: empresa.email,
        subject: 'Bem-vindo à Incluse!',
        title: 'Bem-vindo à Incluse',
        message: `Olá ${empresa.nome},<br><br>Sua empresa foi cadastrada com sucesso na plataforma Incluse!<br>Agora você pode publicar vagas e encontrar talentos PCD.<br><br>Seja bem-vindo!`,
        actionUrl: process.env.APP_BASE_URL || 'http://localhost:5173',
        actionText: 'Acessar plataforma'
      });
    }
    return empresa;
  },

  async checkCnpjExists(cnpj: string): Promise<boolean> {
    const normalized = cnpj.replace(/\D/g, '');
    if (normalized.length !== 14) return false;
    const existing = await EmpresasRepo.findByCnpj(normalized);
    return !!existing;
  },

  async checkEmailExists(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return false;
    const existing = await EmpresasRepo.findByEmail?.(normalized);
    return !!existing;
  },

  async atualizarEmpresa(id: number, data: any) {
    const empresa = await EmpresasRepo.findById(id);
    if (!empresa) throw new Error("Empresa não encontrada");
    
    if (data.cnpj) {
      const cnpjNorm = data.cnpj.replace(/\D/g, '');
      if (cnpjNorm.length !== 14) throw new Error("CNPJ inválido");
      const existente = await EmpresasRepo.findByCnpj(cnpjNorm);
      if (existente && existente.id !== id) {
        throw new Error("CNPJ já cadastrado em outra empresa");
      }
      data.cnpj = cnpjNorm;
    }
    
    if (data.email) {
      const emailNorm = data.email.trim().toLowerCase();
      const existente = await EmpresasRepo.findByEmail(emailNorm);
      if (existente && existente.id !== id) {
        throw new Error("E-mail já cadastrado em outra empresa");
      }
      data.email = emailNorm;
    }
    
    return EmpresasRepo.update(id, data);
  },

  async updateLogo(id: number, logoUrl: string) {
    const empresa = await EmpresasRepo.findById(id);
    if (!empresa) throw new Error("Empresa não encontrada");
    return EmpresasRepo.updateLogo(id, logoUrl);
  },

  async obterConfiguracoes(empresaId: number) {
    return EmpresasRepo.getConfiguracoes(empresaId);
  },

  async atualizarConfiguracoes(empresaId: number, data: any) {
    const empresa = await EmpresasRepo.findById(empresaId);
    if (!empresa) throw new Error("Empresa não encontrada");
    return EmpresasRepo.updateConfiguracoes(empresaId, data);
  },
};
