import { prisma } from "../../prismaClient";

export const EmpresaConfigRepo = {
  async getConfig(empresaId: number) {
    let config = await prisma.empresaConfig.findUnique({ where: { empresaId } });
    if (!config) {
      config = await prisma.empresaConfig.create({ data: { empresaId } });
    }
    return config;
  },

  async updateConfig(empresaId: number, data: Partial<any>) {
    return prisma.empresaConfig.update({
      where: { empresaId },
      data,
    });
  },
};
