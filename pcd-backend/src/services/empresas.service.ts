import { EmpresasRepo } from "../repositories/empresas.repo";
import * as bcrypt from 'bcryptjs';

export const EmpresasService = {
  async criarEmpresa(nome: string, cnpj?: string, email?: string, senha?: string) {
    if (!nome?.trim()) throw new Error("Nome é obrigatório");
    if (cnpj) {
      const existe = await EmpresasRepo.findByCnpj(cnpj);
      if (existe) throw new Error("CNPJ já cadastrado");
    }
    const senhaHash = senha ? bcrypt.hashSync(senha, 8) : undefined;
    return EmpresasRepo.create(nome.trim(), cnpj?.trim(), email?.trim(), senhaHash);
  },
};
//só tem criar empresa, o service só existe quando tem que criar negocio de empresa