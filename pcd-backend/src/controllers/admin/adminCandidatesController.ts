
import { Request, Response } from 'express';
import prisma from '../../prismaClient';

export const adminCandidatesController = {
  async list(req: Request, res: Response) {
    try {
      const candidatos = await prisma.candidato.findMany({
        orderBy: { createdAt: 'desc' },
      });
      const total = await prisma.candidato.count();
      return res.json({ candidatos, total });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro ao buscar candidatos' });
    }
  },
};
