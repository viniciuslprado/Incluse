import { EmpresasRepo } from "../repositories/empresas.repo";
export const EmpresasService = {
  async criarEmpresa(nome: string, cnpj?: string, email?: string) {
    if (!nome?.trim()) throw new Error("Nome é obrigatório");
    if (cnpj) {
      const existe = await EmpresasRepo.findByCnpj(cnpj);
      if (existe) throw new Error("CNPJ já cadastrado");
    }
    return EmpresasRepo.create(nome.trim(), cnpj?.trim(), email?.trim());
  },
};
//só tem criar empresa, o service só existe quando tem que criar negocio de empresa