import { EmpresaConfigRepo } from "../../repositories/empresa/empresa-config.repo";

export const EmpresaConfigService = {
  async getConfig(empresaId: number) {
    return EmpresaConfigRepo.getConfig(empresaId);
  },

  async updateConfig(empresaId: number, data: Partial<any>) {
    return EmpresaConfigRepo.updateConfig(empresaId, data);
  },
};
