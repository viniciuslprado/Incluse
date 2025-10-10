import { Request, Response } from "express";
import { EmpresasRepo } from "../repositories/empresas.repo";
import { EmpresasService } from "../services/empresas.service";

export const EmpresasController = {
  async listar(req: Request, res: Response) {
    const data = await EmpresasRepo.list();
    res.json(data);
  },

  async detalhar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const empresa = await EmpresasRepo.findById(id);
    if (!empresa) return res.status(404).json({ error: "Empresa não encontrada" });
    res.json(empresa);
  },

  async criar(req: Request, res: Response) {
    try {
      const { nome, cnpj, email } = req.body;
      const empresa = await EmpresasService.criarEmpresa(nome, cnpj, email);
      res.status(201).json(empresa);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao criar empresa" });
    }
  },
};