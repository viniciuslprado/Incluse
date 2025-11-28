import { prisma } from "../../prismaClient";

export const CurriculoRepo = {
  getCurriculoCompleto(candidatoId: number) {
    return prisma.candidato.findUnique({
      where: { id: candidatoId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        cidade: true,
        estado: true,
        curriculo: true, // PDF URL
        experiencias: {
          orderBy: { dataInicio: 'desc' }
        },
        formacoes: {
          orderBy: { dataInicio: 'desc' }
        },
        cursos: {
          orderBy: { id: 'desc' }
        },
        competencias: {
          orderBy: { tipo: 'asc' }
        },
        idiomas: {
          orderBy: { id: 'desc' }
        }
      }
    });
  },

  updateCandidato(candidatoId: number, data: any) {
    return prisma.candidato.update({
      where: { id: candidatoId },
      data
    });
  },

  // Experiências
  createExperiencia(data: any) {
    return prisma.candidatoExperiencia.create({ data });
  },

  findExperiencia(id: number) {
    return prisma.candidatoExperiencia.findUnique({ where: { id } });
  },

  updateExperiencia(id: number, data: any) {
    return prisma.candidatoExperiencia.update({ where: { id }, data });
  },

  deleteExperiencia(id: number) {
    return prisma.candidatoExperiencia.delete({ where: { id } });
  },

  // Formações
  createFormacao(data: any) {
    return prisma.candidatoFormacao.create({ data });
  },

  findFormacao(id: number) {
    return prisma.candidatoFormacao.findUnique({ where: { id } });
  },

  updateFormacao(id: number, data: any) {
    return prisma.candidatoFormacao.update({ where: { id }, data });
  },

  deleteFormacao(id: number) {
    return prisma.candidatoFormacao.delete({ where: { id } });
  },

  // Cursos
  createCurso(data: any) {
    return prisma.candidatoCurso.create({ data });
  },

  findCurso(id: number) {
    return prisma.candidatoCurso.findUnique({ where: { id } });
  },

  updateCurso(id: number, data: any) {
    return prisma.candidatoCurso.update({ where: { id }, data });
  },

  deleteCurso(id: number) {
    return prisma.candidatoCurso.delete({ where: { id } });
  },

  // Competências
  createCompetencia(data: any) {
    return prisma.candidatoCompetencia.create({ data });
  },

  findCompetencia(id: number) {
    return prisma.candidatoCompetencia.findUnique({ where: { id } });
  },

  updateCompetencia(id: number, data: any) {
    return prisma.candidatoCompetencia.update({ where: { id }, data });
  },

  deleteCompetencia(id: number) {
    return prisma.candidatoCompetencia.delete({ where: { id } });
  },

  // Idiomas
  createIdioma(data: any) {
    return prisma.candidatoIdioma.create({ data });
  },

  findIdioma(id: number) {
    return prisma.candidatoIdioma.findUnique({ where: { id } });
  },

  updateIdioma(id: number, data: any) {
    return prisma.candidatoIdioma.update({ where: { id }, data });
  },

  deleteIdioma(id: number) {
    return prisma.candidatoIdioma.delete({ where: { id } });
  },
};