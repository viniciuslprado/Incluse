import { Request, Response } from "express";
import { prisma } from '../../prismaClient';

export const AdministradoresController = {
  async criar(req: Request, res: Response) {
    try {
      const { nome, email, senhaHash } = req.body;
      const admin = await prisma.administrador.create({ data: { nome, email, senhaHash } });
      res.status(201).json(admin);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao criar admin" });
    }
  },
  async listar(req: Request, res: Response) {
    try {
      const admins = await prisma.administrador.findMany();
      res.json(admins);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar admins" });
    }
  },
  async detalhar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const admin = await prisma.administrador.findUnique({ where: { id } });
      if (!admin) return res.status(404).json({ error: "Admin não encontrado" });
      res.json(admin);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao detalhar admin" });
    }
  },
  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { nome, email, senhaHash } = req.body;
      const admin = await prisma.administrador.update({ where: { id }, data: { nome, email, senhaHash } });
      res.json(admin);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar admin" });
    }
  },
  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await prisma.administrador.delete({ where: { id } });
      res.status(204).end();
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao deletar admin" });
    }
  },
};
