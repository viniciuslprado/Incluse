import { VagasRepo } from "../repositories/vagas.repo";
import { prisma } from "../repositories/prisma";

export const VagasService = {
  async criarVaga(empresaId: number, descricao: string, escolaridade: string) {
    if (!empresaId) throw new Error("empresaId é obrigatório");
    if (!descricao?.trim()) throw new Error("descricao é obrigatória");
    if (!escolaridade?.trim()) throw new Error("escolaridade é obrigatória");

    // valida existência da empresa
    const empresa = await prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) throw new Error("Empresa não encontrada");

    return VagasRepo.create(empresaId, descricao.trim(), escolaridade.trim());
  },

  async vincularSubtipos(vagaId: number, subtipoIds: number[]) {
    if (!vagaId || !Array.isArray(subtipoIds) || subtipoIds.length === 0) {
      throw new Error("Informe vagaId e pelo menos um subtipoId");
    }
    // valida vaga
    const vaga = await prisma.vaga.findUnique({ where: { id: vagaId } });
    if (!vaga) throw new Error("Vaga não encontrada");

    return VagasRepo.linkSubtipos(vagaId, subtipoIds);
  },

  async vincularAcessibilidades(vagaId: number, acessibilidadeIds: number[]) {
    if (!vagaId || !Array.isArray(acessibilidadeIds) || acessibilidadeIds.length === 0) {
      throw new Error("Informe vagaId e pelo menos um acessibilidadeId");
    }
    // valida vaga
    const vaga = await prisma.vaga.findUnique({ where: { id: vagaId } });
    if (!vaga) throw new Error("Vaga não encontrada");

    return VagasRepo.linkAcessibilidades(vagaId, acessibilidadeIds);
  },
};