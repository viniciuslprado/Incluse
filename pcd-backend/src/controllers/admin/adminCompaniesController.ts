
import { Request, Response } from 'express';
import prisma from '../../prismaClient';

export const adminCompaniesController = {
  async list(req: Request, res: Response) {
    try {
      const empresas = await prisma.empresa.findMany({
        orderBy: { createdAt: 'desc' },
      });
      const total = await prisma.empresa.count();
      return res.json({ empresas, total });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro ao buscar empresas' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ error: 'ID inválido' });
      const empresa = await prisma.empresa.findUnique({
        where: { id },
        include: {
          avaliacoes: true,
        },
      });
      if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' });
      return res.json(empresa);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro ao buscar empresa' });
    }
  },
  async updateStatus(req: Request, res: Response) {
    return res.json({ success: true });
  },
};
