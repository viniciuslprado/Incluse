
import { Request, Response } from 'express';
import prisma from '../../prismaClient';

export const adminJobsController = {
  async list(req: Request, res: Response) {
    try {
      const vagas = await prisma.vaga.findMany({
        orderBy: { createdAt: 'desc' },
        include: { empresa: true },
      });
      const total = await prisma.vaga.count();
      return res.json({ vagas, total });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro ao buscar vagas' });
    }
  },
  async updateStatus(req: Request, res: Response) {

    return res.json({ success: true });
  },
};
