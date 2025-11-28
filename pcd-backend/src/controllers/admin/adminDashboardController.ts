import { Request, Response } from 'express';

export const adminDashboardController = {
  async getDashboard(req: Request, res: Response) {
    return res.json({
      empresas: { total: 0, ativas: 0, inativas: 0 },
      candidatos: { total: 0 },
      vagas: { total: 0, ativas: 0, pausadas: 0, encerradas: 0 },
      candidaturas: { total: 0 },
    });
  },
};
