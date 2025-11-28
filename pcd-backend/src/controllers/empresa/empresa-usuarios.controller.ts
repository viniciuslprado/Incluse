import { Request, Response } from "express";
import { EmpresaUsuariosService } from "../../services/empresa/empresa-usuarios.service";

export const EmpresaUsuariosController = {
  async listar(req: Request, res: Response) {
    try {
      const empresaId = (req as any).user?.id;
      const usuarios = await EmpresaUsuariosService.listarUsuarios(empresaId);
      res.json(usuarios);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar usuários" });
    }
  },

  async criar(req: Request, res: Response) {
    try {
      const empresaId = (req as any).user?.id;
      const usuario = await EmpresaUsuariosService.criarUsuario(empresaId, req.body);
      res.status(201).json(usuario);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao criar usuário" });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const empresaId = (req as any).user?.id;
      const usuario = await EmpresaUsuariosService.atualizarUsuario(id, empresaId, req.body);
      res.json(usuario);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar usuário" });
    }
  },

  async desativar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const empresaId = (req as any).user?.id;
      await EmpresaUsuariosService.desativarUsuario(id, empresaId);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao desativar usuário" });
    }
  },
};