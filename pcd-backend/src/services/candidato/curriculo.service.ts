import { CurriculoRepo } from "../../repositories/candidato/curriculo.repo";

export const CurriculoService = {
  async obterCurriculo(candidatoId: number) {
    return CurriculoRepo.getCurriculoCompleto(candidatoId);
  },

  async atualizarDadosPessoais(candidatoId: number, data: any) {
    const updateData: any = {};
    if (data.nome) updateData.nome = data.nome.trim();
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.cidade !== undefined) updateData.cidade = data.cidade;
    if (data.estado !== undefined) updateData.estado = data.estado;
    
    return CurriculoRepo.updateCandidato(candidatoId, updateData);
  },

  async adicionarExperiencia(candidatoId: number, data: any) {
    const { cargo, empresa, dataInicio, dataFim, atual, descricao } = data;
    
    if (!cargo?.trim()) throw new Error("Cargo é obrigatório");
    if (!empresa?.trim()) throw new Error("Empresa é obrigatória");
    if (!dataInicio) throw new Error("Data de início é obrigatória");
    if (!atual && !dataFim) throw new Error("Data de término é obrigatória quando não está trabalhando atualmente");
    
    return CurriculoRepo.createExperiencia({
      candidatoId,
      cargo: cargo.trim(),
      empresa: empresa.trim(),
      dataInicio: new Date(dataInicio),
      dataFim: dataFim ? new Date(dataFim) : null,
      atual: !!atual,
      descricao: descricao?.trim()
    });
  },

  async atualizarExperiencia(candidatoId: number, expId: number, data: any) {
    const exp = await CurriculoRepo.findExperiencia(expId);
    if (!exp || exp.candidatoId !== candidatoId) {
      throw new Error("Experiência não encontrada");
    }
    
    return CurriculoRepo.updateExperiencia(expId, data);
  },

  async removerExperiencia(candidatoId: number, expId: number) {
    const exp = await CurriculoRepo.findExperiencia(expId);
    if (!exp || exp.candidatoId !== candidatoId) {
      throw new Error("Experiência não encontrada");
    }
    
    return CurriculoRepo.deleteExperiencia(expId);
  },

  async adicionarFormacao(candidatoId: number, data: any) {
    const { escolaridade, instituicao, curso, situacao, dataInicio, dataFim } = data;
    
    if (!escolaridade?.trim()) throw new Error("Escolaridade é obrigatória");
    
    const isEnsinoSuperior = ['Ensino Superior Incompleto', 'Ensino Superior Completo', 'Pós-graduação', 'Mestrado', 'Doutorado'].includes(escolaridade);
    
    if (isEnsinoSuperior) {
      if (!instituicao?.trim()) throw new Error("Instituição é obrigatória para ensino superior");
      if (!curso?.trim()) throw new Error("Curso é obrigatório para ensino superior");
      if (!situacao) throw new Error("Situação é obrigatória para ensino superior");
      if (!dataInicio) throw new Error("Data de início é obrigatória para ensino superior");
      if (situacao === 'concluido' && !dataFim) throw new Error("Data de término é obrigatória para cursos concluídos");
    }
    
    return CurriculoRepo.createFormacao({
      candidatoId,
      escolaridade: escolaridade.trim(),
      instituicao: instituicao?.trim(),
      curso: curso?.trim(),
      situacao,
      dataInicio: dataInicio ? new Date(dataInicio) : null,
      dataFim: dataFim ? new Date(dataFim) : null
    });
  },

  async atualizarFormacao(candidatoId: number, formId: number, data: any) {
    const form = await CurriculoRepo.findFormacao(formId);
    if (!form || form.candidatoId !== candidatoId) {
      throw new Error("Formação não encontrada");
    }
    
    return CurriculoRepo.updateFormacao(formId, data);
  },

  async removerFormacao(candidatoId: number, formId: number) {
    const form = await CurriculoRepo.findFormacao(formId);
    if (!form || form.candidatoId !== candidatoId) {
      throw new Error("Formação não encontrada");
    }
    
    return CurriculoRepo.deleteFormacao(formId);
  },

  async adicionarCurso(candidatoId: number, data: any) {
    const { nome, instituicao, cargaHoraria, certificado } = data;
    
    if (!nome?.trim()) throw new Error("Nome do curso é obrigatório");
    if (!instituicao?.trim()) throw new Error("Instituição é obrigatória");
    
    return CurriculoRepo.createCurso({
      candidatoId,
      nome: nome.trim(),
      instituicao: instituicao.trim(),
      cargaHoraria: cargaHoraria ? Number(cargaHoraria) : null,
      certificado
    });
  },

  async atualizarCurso(candidatoId: number, cursoId: number, data: any) {
    const curso = await CurriculoRepo.findCurso(cursoId);
    if (!curso || curso.candidatoId !== candidatoId) {
      throw new Error("Curso não encontrado");
    }
    
    return CurriculoRepo.updateCurso(cursoId, data);
  },

  async removerCurso(candidatoId: number, cursoId: number) {
    const curso = await CurriculoRepo.findCurso(cursoId);
    if (!curso || curso.candidatoId !== candidatoId) {
      throw new Error("Curso não encontrado");
    }
    
    return CurriculoRepo.deleteCurso(cursoId);
  },

  async adicionarCompetencia(candidatoId: number, data: any) {
    const { tipo, nome, nivel } = data;
    
    if (!tipo || !['hard_skill', 'soft_skill'].includes(tipo)) {
      throw new Error("Tipo deve ser 'hard_skill' ou 'soft_skill'");
    }
    if (!nome?.trim()) throw new Error("Nome da competência é obrigatório");
    if (!nivel || !['basico', 'intermediario', 'avancado'].includes(nivel)) {
      throw new Error("Nível deve ser 'basico', 'intermediario' ou 'avancado'");
    }
    
    return CurriculoRepo.createCompetencia({
      candidatoId,
      tipo,
      nome: nome.trim(),
      nivel
    });
  },

  async atualizarCompetencia(candidatoId: number, compId: number, data: any) {
    const comp = await CurriculoRepo.findCompetencia(compId);
    if (!comp || comp.candidatoId !== candidatoId) {
      throw new Error("Competência não encontrada");
    }
    
    return CurriculoRepo.updateCompetencia(compId, data);
  },

  async removerCompetencia(candidatoId: number, compId: number) {
    const comp = await CurriculoRepo.findCompetencia(compId);
    if (!comp || comp.candidatoId !== candidatoId) {
      throw new Error("Competência não encontrada");
    }
    
    return CurriculoRepo.deleteCompetencia(compId);
  },

  async adicionarIdioma(candidatoId: number, data: any) {
    const { idioma, nivel, certificado } = data;
    
    if (!idioma?.trim()) throw new Error("Idioma é obrigatório");
    if (!nivel?.trim()) throw new Error("Nível é obrigatório");
    
    return CurriculoRepo.createIdioma({
      candidatoId,
      idioma: idioma.trim(),
      nivel: nivel.trim(),
      certificado
    });
  },

  async atualizarIdioma(candidatoId: number, idiomaId: number, data: any) {
    const idioma = await CurriculoRepo.findIdioma(idiomaId);
    if (!idioma || idioma.candidatoId !== candidatoId) {
      throw new Error("Idioma não encontrado");
    }
    
    return CurriculoRepo.updateIdioma(idiomaId, data);
  },

  async removerIdioma(candidatoId: number, idiomaId: number) {
    const idioma = await CurriculoRepo.findIdioma(idiomaId);
    if (!idioma || idioma.candidatoId !== candidatoId) {
      throw new Error("Idioma não encontrado");
    }
    
    return CurriculoRepo.deleteIdioma(idiomaId);
  },
};