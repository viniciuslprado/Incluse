import { VagasRepo } from "../../repositories/common/vagas.repo";

export const VagasService = {
  async criarVaga(vagaData: any) {
    // Validações básicas
    if (!vagaData.empresaId) throw new Error("ID da empresa é obrigatório");
    if (!vagaData.titulo?.trim()) throw new Error("Título da vaga é obrigatório");
    
    // Processar e validar dados
    const processedData: any = {
      empresaId: Number(vagaData.empresaId),
      titulo: vagaData.titulo.trim(),
      tipoContratacao: vagaData.tipoContratacao,
      modeloTrabalho: vagaData.modeloTrabalho,
      localizacao: vagaData.localizacao,
      area: vagaData.area,
      status: vagaData.status || 'ativa',
      escolaridade: vagaData.escolaridade,
      cidade: vagaData.cidade,
      estado: vagaData.estado,
    };

    // Processar seções aninhadas
    if (vagaData.descricao) {
      processedData.descricao = {
        resumo: vagaData.descricao.resumo,
        atividades: vagaData.descricao.atividades,
        jornada: vagaData.descricao.jornada,
        salarioMin: vagaData.descricao.salarioMin ? Number(vagaData.descricao.salarioMin) : undefined,
        salarioMax: vagaData.descricao.salarioMax ? Number(vagaData.descricao.salarioMax) : undefined,
      };
    }

    if (vagaData.requisitos) {
      processedData.requisitos = {
        formacao: vagaData.requisitos.formacao,
        experiencia: vagaData.requisitos.experiencia,
        competencias: typeof vagaData.requisitos.competencias === 'string' 
          ? vagaData.requisitos.competencias 
          : JSON.stringify(vagaData.requisitos.competencias),
        habilidadesTecnicas: typeof vagaData.requisitos.habilidadesTecnicas === 'string' 
          ? vagaData.requisitos.habilidadesTecnicas 
          : JSON.stringify(vagaData.requisitos.habilidadesTecnicas),
      };
    }

    if (vagaData.beneficios && Array.isArray(vagaData.beneficios)) {
      processedData.beneficios = vagaData.beneficios.filter((b: any) => b?.trim());
    }

    if (vagaData.processos && Array.isArray(vagaData.processos)) {
      processedData.processos = vagaData.processos.map((p: any, idx: number) => ({
        etapa: p.etapa,
        ordem: p.ordem !== undefined ? Number(p.ordem) : idx + 1
      }));
    }

    if (vagaData.subtipoIds && Array.isArray(vagaData.subtipoIds)) {
      processedData.subtipoIds = vagaData.subtipoIds.map((id: any) => Number(id));
    }

    if (vagaData.acessibilidadeIds && Array.isArray(vagaData.acessibilidadeIds)) {
      processedData.acessibilidadeIds = vagaData.acessibilidadeIds.map((id: any) => Number(id));
    }

    return VagasRepo.createComplete(processedData);
  },

  async listarVagas(empresaId?: number, filters?: any, page = 1, limit = 10) {
    const vagas = await VagasRepo.list(empresaId, filters, page, limit);
    const total = await VagasRepo.count(empresaId, filters);
    
    return {
      data: vagas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async obterVaga(id: number) {
    const vaga = await VagasRepo.findById(id);
    if (!vaga) throw new Error("Vaga não encontrada");
    return vaga;
  },

  async atualizarVaga(id: number, vagaData: any) {
    const vaga = await VagasRepo.findById(id);
    if (!vaga) throw new Error("Vaga não encontrada");

    // Atualizar campos simples
    await VagasRepo.update(id, vagaData);

    // Atualizar descrição se fornecida (aceita 'descricao' ou 'descricaoVaga')
    const descricaoSource = vagaData.descricaoVaga || vagaData.descricao;
    if (descricaoSource) {
      const descricaoData: any = {
        resumo: descricaoSource.resumo,
        atividades: descricaoSource.atividades,
        jornada: descricaoSource.jornada,
        salarioMin: descricaoSource.salarioMin ? Number(descricaoSource.salarioMin) : undefined,
        salarioMax: descricaoSource.salarioMax ? Number(descricaoSource.salarioMax) : undefined,
      };
      await VagasRepo.updateDescricao(id, descricaoData);
    }

    // Atualizar requisitos se fornecidos
    if (vagaData.requisitos) {
      const requisitosData: any = {
        formacao: vagaData.requisitos.formacao,
        experiencia: vagaData.requisitos.experiencia,
        competencias: typeof vagaData.requisitos.competencias === 'string' 
          ? vagaData.requisitos.competencias 
          : JSON.stringify(vagaData.requisitos.competencias),
        habilidadesTecnicas: typeof vagaData.requisitos.habilidadesTecnicas === 'string' 
          ? vagaData.requisitos.habilidadesTecnicas 
          : JSON.stringify(vagaData.requisitos.habilidadesTecnicas),
      };
      await VagasRepo.updateRequisitos(id, requisitosData);
    }

    // Substituir benefícios se fornecidos
    if (vagaData.beneficios && Array.isArray(vagaData.beneficios)) {
      const beneficios = vagaData.beneficios.filter((b: any) => b?.trim());
      await VagasRepo.replaceBeneficios(id, beneficios);
    }

    // Substituir processos se fornecidos
    if (vagaData.processos && Array.isArray(vagaData.processos)) {
      const processos = vagaData.processos.map((p: any, idx: number) => ({
        etapa: p.etapa,
        ordem: p.ordem !== undefined ? Number(p.ordem) : idx + 1
      }));
      await VagasRepo.replaceProcessos(id, processos);
    }

    // Substituir acessibilidades se fornecidas
    if (vagaData.acessibilidadeIds && Array.isArray(vagaData.acessibilidadeIds)) {
      const acessibilidadeIds = vagaData.acessibilidadeIds.map((id: any) => Number(id));
      await VagasRepo.replaceAcessibilidades(id, acessibilidadeIds);
    }

    return VagasRepo.findById(id);
  },

  async atualizarStatus(id: number, status: string) {
    const vaga = await VagasRepo.findById(id);
    if (!vaga) throw new Error("Vaga não encontrada");
    
    const statusValidos = ['ativa', 'pausada', 'encerrada'];
    if (!statusValidos.includes(status)) {
      throw new Error("Status inválido. Use: ativa, pausada ou encerrada");
    }
    
    return VagasRepo.updateStatus(id, status);
  },

  async deletarVaga(id: number) {
    const vaga = await VagasRepo.findById(id);
    if (!vaga) throw new Error("Vaga não encontrada");
    return VagasRepo.delete(id);
  },

  async obterCandidatos(vagaId: number, page = 1, limit = 20) {
    const candidatos = await VagasRepo.getCandidatos(vagaId, page, limit);
    const total = await VagasRepo.countCandidatos(vagaId);
    
    return {
      data: candidatos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async obterCandidatoDetalhes(vagaId: number, candidatoId: number) {
    const candidatura = await VagasRepo.getCandidatoDetalhes(vagaId, candidatoId);
    if (!candidatura) throw new Error("Candidatura não encontrada");
    return candidatura;
  },

  async atualizarStatusCandidato(vagaId: number, candidatoId: number, data: any) {
    const { status } = data;
    if (status) {
      const statusValidos = ['pendente', 'em_analise', 'aprovado', 'rejeitado'];
      if (!statusValidos.includes(status)) {
        throw new Error("Status inválido. Use: pendente, em_analise, aprovado ou rejeitado");
      }
    }
    return VagasRepo.updateCandidatoStatus(vagaId, candidatoId, data);
  },

  async duplicarVaga(vagaId: number, empresaId: number) {
    const vaga: any = await VagasRepo.findById(vagaId);
    if (!vaga || vaga.empresaId !== empresaId) throw new Error("Vaga não encontrada");
    const novaVagaData: any = {
      empresaId,
      titulo: `${vaga.titulo} (Cópia)`,
      tipoContratacao: vaga.tipoContratacao,
      modeloTrabalho: vaga.modeloTrabalho,
      localizacao: vaga.localizacao,
      area: vaga.area,
      status: 'ativa',
      escolaridade: vaga.escolaridade,
      cidade: vaga.cidade,
      estado: vaga.estado
    };
    if (vaga.descricaoVaga) {
      novaVagaData.descricao = {
        resumo: vaga.descricaoVaga.resumo,
        atividades: vaga.descricaoVaga.atividades,
        jornada: vaga.descricaoVaga.jornada,
        salarioMin: vaga.descricaoVaga.salarioMin,
        salarioMax: vaga.descricaoVaga.salarioMax
      };
    }
    if (vaga.requisitos) {
      novaVagaData.requisitos = {
        formacao: vaga.requisitos.formacao,
        experiencia: vaga.requisitos.experiencia,
        competencias: vaga.requisitos.competencias,
        habilidadesTecnicas: vaga.requisitos.habilidadesTecnicas
      };
    }
    if (vaga.beneficios?.length) {
      novaVagaData.beneficios = vaga.beneficios.map((b: any) => b.descricao).filter(Boolean);
    }
    if (vaga.processos?.length) {
      novaVagaData.processos = vaga.processos.map((p: any) => ({ etapa: p.etapa, ordem: p.ordem }));
    }
    if (vaga.subtiposAceitos?.length) {
      novaVagaData.subtipoIds = vaga.subtiposAceitos.map((s: any) => s.subtipoId);
    }
    if (vaga.acessibilidades?.length) {
      novaVagaData.acessibilidadeIds = vaga.acessibilidades.map((a: any) => a.acessibilidadeId);
    }
    return VagasRepo.createComplete(novaVagaData);
  },

  async obterFiltros(empresaId: number) {
    return VagasRepo.getFiltros(empresaId);
  },

  async pesquisarVagas(empresaId: number, filtros: any) {
    const { termo, status, area, modeloTrabalho, page = 1, limit = 10 } = filtros;
    
    const where: any = { empresaId };
    
    if (termo) {
      where.OR = [
        { titulo: { contains: termo, mode: 'insensitive' } },
        { area: { contains: termo, mode: 'insensitive' } },
        { localizacao: { contains: termo, mode: 'insensitive' } }
      ];
    }
    
    if (status) where.status = status;
    if (area) where.area = { contains: area, mode: 'insensitive' };
    if (modeloTrabalho) where.modeloTrabalho = modeloTrabalho;
    
    const vagas = await VagasRepo.searchVagas(where, page, limit);
    const total = await VagasRepo.countSearch(where);
    
    return {
      data: vagas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },
};
