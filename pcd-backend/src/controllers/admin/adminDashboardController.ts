
import { Request, Response } from 'express';
import prisma from '../../prismaClient';

export const adminDashboardController = {
  async getDashboard(req: Request, res: Response) {
    try {
      // Empresas
      const totalEmpresas = await prisma.empresa.count();
      const empresasAtivas = await prisma.empresa.count({ where: { isActive: true } });
      const empresasInativas = await prisma.empresa.count({ where: { isActive: false } });

      // Candidatos
      const totalCandidatos = await prisma.candidato.count();

      // Vagas
      const totalVagas = await prisma.vaga.count();
      const vagasAtivas = await prisma.vaga.count({ where: { status: 'ativa' } });
      const vagasPausadas = await prisma.vaga.count({ where: { status: 'pausada' } });
      const vagasEncerradas = await prisma.vaga.count({ where: { status: 'encerrada' } });

      // Candidaturas
      const totalCandidaturas = await prisma.candidatura.count();

      // Vagas encerradas sem candidaturas
      const vagasEncerradasSemCandidaturas = await prisma.vaga.count({
        where: {
          status: 'encerrada',
          candidaturas: { none: {} },
        },
      });

      // Vagas encerradas com candidaturas
      const vagasEncerradasComCandidaturas = await prisma.vaga.count({
        where: {
          status: 'encerrada',
          candidaturas: { some: {} },
        },
      });

      // Média de vagas por empresa
      let mediaVagasPorEmpresa = null;
      if (empresasAtivas > 0) {
        mediaVagasPorEmpresa = await prisma.vaga.count({ where: { isActive: true } }) / empresasAtivas;
        mediaVagasPorEmpresa = Number(mediaVagasPorEmpresa.toFixed(2));
      }

      return res.json({
        empresas: { total: totalEmpresas, ativas: empresasAtivas, inativas: empresasInativas },
        candidatos: { total: totalCandidatos },
        vagas: {
          total: totalVagas,
          ativas: vagasAtivas,
          pausadas: vagasPausadas,
          encerradas: vagasEncerradas,
        },
        candidaturas: { total: totalCandidaturas },
        vagasEncerradasSemCandidaturas,
        vagasEncerradasComCandidaturas,
        mediaVagasPorEmpresa,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro ao buscar dados do dashboard' });
    }
  },
};
