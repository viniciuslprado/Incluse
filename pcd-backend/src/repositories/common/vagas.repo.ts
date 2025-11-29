import { prisma } from "../../prismaClient";

export const VagasRepo = {
  list(empresaId?: number, filters?: any, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (empresaId) where.empresaId = empresaId;
    if (filters?.status) where.status = filters.status;
    if (filters?.areaId) where.areaId = Number(filters.areaId);
    if (filters?.modeloTrabalho) where.modeloTrabalho = filters.modeloTrabalho;
    return prisma.vaga.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        empresa: { select: { id: true, nome: true, email: true, cnpj: true } },
        area: { select: { id: true, nome: true } },
        descricaoVaga: true,
        requisitos: true,
        beneficios: true,
        processos: { orderBy: { ordem: 'asc' } },
        subtiposAceitos: { include: { subtipo: { select: { id: true, nome: true } } } },
        acessibilidades: { include: { acessibilidade: { select: { id: true, descricao: true } } } },
        _count: { select: { candidaturas: true } }
      }
    });
  },

  async count(empresaId?: number, filters?: any) {
    const where: any = {};
    if (empresaId) where.empresaId = empresaId;
    if (filters?.status) where.status = filters.status;
    if (filters?.area) where.area = { contains: filters.area, mode: 'insensitive' };
    if (filters?.modeloTrabalho) where.modeloTrabalho = filters.modeloTrabalho;
    return prisma.vaga.count({ where });
  },

  findById(id: number) {
    return prisma.vaga.findUnique({
      where: { id },
      include: {
        empresa: { select: { id: true, nome: true, email: true, cnpj: true } },
        descricaoVaga: true,
        requisitos: true,
        beneficios: { orderBy: { id: 'asc' } },
        processos: { orderBy: { ordem: 'asc' } },
        subtiposAceitos: { include: { subtipo: { select: { id: true, nome: true, tipoId: true } } }, orderBy: { subtipoId: 'asc' } },
        acessibilidades: { include: { acessibilidade: { select: { id: true, descricao: true } } }, orderBy: { acessibilidadeId: 'asc' } }
      }
    });
  },

  async createComplete(vagaData: {
    empresaId: number;
    titulo: string;
    tipoContratacao?: string;
    modeloTrabalho?: string;
    localizacao?: string;
    areaId?: number;
    status?: string;
    escolaridade?: string;
    cidade?: string;
    estado?: string;
    descricao?: { resumo?: string; atividades?: string; jornada?: string; salarioMin?: number; salarioMax?: number };
    requisitos?: { formacao?: string; experiencia?: string; competencias?: string; habilidadesTecnicas?: string };
    beneficios?: string[];
    processos?: { etapa: string; ordem: number }[];
    subtipoIds?: number[];
    acessibilidadeIds?: number[];
  }) {
    return (prisma as any).vaga.create({
      data: {
        empresaId: vagaData.empresaId,
        titulo: vagaData.titulo,
        tipoContratacao: vagaData.tipoContratacao,
        modeloTrabalho: vagaData.modeloTrabalho,
        localizacao: vagaData.localizacao,
        areaId: vagaData.areaId,
        status: vagaData.status || 'ativa',
        escolaridade: vagaData.escolaridade,
        cidade: vagaData.cidade,
        estado: vagaData.estado,
        ...(vagaData.descricao && { descricaoVaga: { create: vagaData.descricao } }),
        ...(vagaData.requisitos && { requisitos: { create: vagaData.requisitos } }),
        ...(vagaData.beneficios && vagaData.beneficios.length && { beneficios: { createMany: { data: vagaData.beneficios.map(d => ({ descricao: d })) } } }),
        ...(vagaData.processos && vagaData.processos.length && { processos: { createMany: { data: vagaData.processos } } }),
        ...(vagaData.subtipoIds && vagaData.subtipoIds.length && { subtiposAceitos: { createMany: { data: vagaData.subtipoIds.map(id => ({ subtipoId: id })) } } }),
        ...(vagaData.acessibilidadeIds && vagaData.acessibilidadeIds.length && { acessibilidades: { createMany: { data: vagaData.acessibilidadeIds.map(id => ({ acessibilidadeId: id })) } } })
      },
      include: { descricaoVaga: true, requisitos: true, beneficios: true, processos: true }
    });
  },

  async update(id: number, vagaData: any) {
    const updateData: any = {};
    const simpleFields = ['titulo', 'tipoContratacao', 'modeloTrabalho', 'localizacao', 'areaId', 'status', 'escolaridade', 'cidade', 'estado'];
    for (const f of simpleFields) if (vagaData[f] !== undefined) updateData[f] = vagaData[f];
    return (prisma as any).vaga.update({
      where: { id },
      data: updateData,
      include: {
        descricaoVaga: true,
        requisitos: true,
        beneficios: true,
        processos: true
      }
    });
  },

  async updateDescricao(vagaId: number, descricao: any) {
    const exists = await (prisma as any).vagaDescricao.findUnique({ where: { vagaId } });
    if (exists) {
      return (prisma as any).vagaDescricao.update({ where: { vagaId }, data: descricao });
    }
    return (prisma as any).vagaDescricao.create({ data: { vagaId, ...descricao } });
  },

  async updateRequisitos(vagaId: number, requisitos: any) {
    const exists = await (prisma as any).vagaRequisitos.findUnique({ where: { vagaId } });
    if (exists) {
      return (prisma as any).vagaRequisitos.update({ where: { vagaId }, data: requisitos });
    }
    return (prisma as any).vagaRequisitos.create({ data: { vagaId, ...requisitos } });
  },

  async replaceBeneficios(vagaId: number, beneficios: string[]) {
    await (prisma as any).vagaBeneficio.deleteMany({ where: { vagaId } });
    if (beneficios.length) {
      await (prisma as any).vagaBeneficio.createMany({ data: beneficios.map(b => ({ vagaId, descricao: b })) });
    }
  },

  async replaceProcessos(vagaId: number, processos: { etapa: string; ordem: number }[]) {
    await (prisma as any).vagaProcesso.deleteMany({ where: { vagaId } });
    if (processos.length) {
      await (prisma as any).vagaProcesso.createMany({ data: processos.map(p => ({ vagaId, etapa: p.etapa, ordem: p.ordem })) });
    }
  },

  async replaceAcessibilidades(vagaId: number, acessibilidadeIds: number[]) {
    await (prisma as any).vagaAcessibilidade.deleteMany({ where: { vagaId } });
    if (acessibilidadeIds.length) {
      await (prisma as any).vagaAcessibilidade.createMany({ data: acessibilidadeIds.map(id => ({ vagaId, acessibilidadeId: id })), skipDuplicates: true });
    }
  },

  async updateStatus(id: number, status: string) {
    return (prisma as any).vaga.update({ where: { id }, data: { status } });
  },

  async delete(id: number) {
    return prisma.vaga.delete({ where: { id } });
  },

  linkSubtipos(vagaId: number, subtipoIds: number[]) {
    return prisma.vagaSubtipo.createMany({ data: subtipoIds.map(s => ({ vagaId, subtipoId: s })), skipDuplicates: true });
  },

  linkAcessibilidades(vagaId: number, acessibilidadeIds: number[]) {
    return prisma.vagaAcessibilidade.createMany({ data: acessibilidadeIds.map(a => ({ vagaId, acessibilidadeId: a })), skipDuplicates: true });
  },

  async getCandidatos(vagaId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return prisma.candidatura.findMany({
      where: { vagaId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        candidato: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            escolaridade: true,
            curriculo: true,
            subtipos: { include: { subtipo: { select: { id: true, nome: true } } } }
          }
        }
      }
    });
  },

  async countCandidatos(vagaId: number) {
    return prisma.candidatura.count({ where: { vagaId } });
  },

  async getCandidatoDetalhes(vagaId: number, candidatoId: number) {
    return prisma.candidatura.findUnique({
      where: { vagaId_candidatoId: { vagaId, candidatoId } },
      include: {
        candidato: {
          include: {
            subtipos: { include: { subtipo: { select: { id: true, nome: true, tipoId: true } } } },
            barras: { include: { barreira: { select: { id: true, descricao: true } }, subtipo: { select: { id: true, nome: true } } } }
          }
        }
      }
    });
  },

  async updateCandidatoStatus(vagaId: number, candidatoId: number, data: any) {
    const candidatura = await prisma.candidatura.findUnique({ where: { vagaId_candidatoId: { vagaId, candidatoId } }, include: { vaga: { select: { titulo: true } } } });
    if (!candidatura) throw new Error('Candidatura não encontrada');
    const updateData: any = {};
    if (data.status && data.status !== candidatura.status) updateData.status = data.status;
    if (data.anotacoes !== undefined) updateData.anotacoes = data.anotacoes;
    const updated = await prisma.candidatura.update({ where: { vagaId_candidatoId: { vagaId, candidatoId } }, data: updateData });
    if (updateData.status) {
      await prisma.notificacao.create({
        data: {
          candidatoId,
          vagaId,
          tipo: 'atualizacao_candidatura',
          titulo: 'Atualização de candidatura',
          mensagem: `Sua candidatura para "${candidatura.vaga.titulo}" foi atualizada.`
        }
      });
    }
    return updated;
  },

  async getFiltros(empresaId: number) {
    const areas = await prisma.vaga.findMany({ where: { empresaId, area: { not: null } }, select: { area: true }, distinct: ['area'] });
    const modelos = await prisma.vaga.findMany({ where: { empresaId, modeloTrabalho: { not: null } }, select: { modeloTrabalho: true }, distinct: ['modeloTrabalho'] });
    return { areas: areas.map(v => v.area).filter(Boolean), modelosTrabalho: modelos.map(v => v.modeloTrabalho).filter(Boolean), status: ['ativa', 'pausada', 'encerrada'] };
  },

  async searchVagas(where: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return prisma.vaga.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { empresa: { select: { nome: true } }, _count: { select: { candidaturas: true } } }
    });
  },

  async countSearch(where: any) {
    return prisma.vaga.count({ where });
  }
};
