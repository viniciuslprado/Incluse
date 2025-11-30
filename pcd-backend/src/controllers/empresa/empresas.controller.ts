import { Request, Response } from "express";
import { EmpresasRepo } from "../../repositories/empresa/empresas.repo";
import { EmpresasService } from "../../services/empresa/empresas.service";

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
      const { nome, cnpj, email, senha, telefone, endereco, areaAtuacao, descricao, logoUrl } = req.body;
      const empresa = await EmpresasService.criarEmpresa(
        nome, cnpj, email, senha, telefone, endereco, areaAtuacao, descricao, logoUrl
      );
      res.status(201).json(empresa);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao criar empresa" });
    }
  },

  async checkCnpj(req: Request, res: Response) {
    try {
      const cnpj = String(req.params.cnpj).replace(/\D/g, '');
      const exists = await EmpresasService.checkCnpjExists(cnpj);
      res.json({ exists });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Erro ao verificar CNPJ' });
    }
  },

  async checkEmail(req: Request, res: Response) {
    try {
      const email = String(req.params.email);
      const exists = await EmpresasService.checkEmailExists(email);
      res.json({ exists });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Erro ao verificar e-mail' });
    }
  },

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const empresa = await EmpresasService.atualizarEmpresa(id, data);
      res.json(empresa);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar empresa" });
    }
  },

  // GET /empresa/me - Obter dados da empresa autenticada
  async obterPerfil(req: Request, res: Response) {
    try {
      const empresaId = (req as any).user?.id;
      if (!empresaId) {
        return res.status(401).json({ error: "Não autenticado" });
      }
      const empresa = await EmpresasRepo.findById(empresaId);
      if (!empresa) {
        return res.status(404).json({ error: "Empresa não encontrada" });
      }
      res.json(empresa);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao obter perfil" });
    }
  },

  // PUT /empresa/update - Atualizar dados da empresa autenticada
  async atualizarPerfil(req: Request, res: Response) {
    try {
      const empresaId = (req as any).user?.id;
      if (!empresaId) {
        return res.status(401).json({ error: "Não autenticado" });
      }
      const empresa = await EmpresasService.atualizarEmpresa(empresaId, req.body);
      res.json(empresa);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar empresa" });
    }
  },

  // POST /empresa/logo - Upload de logo
  async uploadLogo(req: Request, res: Response) {
    try {
      const empresaId = (req as any).user?.id;
      if (!empresaId) {
        return res.status(401).json({ error: "Não autenticado" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      const logoUrl = `/uploads/logos/${req.file.filename}`;
      const empresa = await EmpresasService.updateLogo(empresaId, logoUrl);
      res.json({ logoUrl, empresa });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao fazer upload do logo" });
    }
  },

  // GET /empresa/configuracoes - Obter configurações
  async obterConfiguracoes(req: Request, res: Response) {
    try {
      const empresaId = (req as any).user?.id;
      const config = await EmpresasService.obterConfiguracoes(empresaId);
      res.json(config);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao obter configurações" });
    }
  },

  // PUT /empresa/configuracoes - Atualizar configurações
  async atualizarConfiguracoes(req: Request, res: Response) {
    try {
      const empresaId = (req as any).user?.id;
      const config = await EmpresasService.atualizarConfiguracoes(empresaId, req.body);
      res.json(config);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar configurações" });
    }
  },
};