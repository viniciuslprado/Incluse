import { Request, Response } from "express";
import { EmpresaConfigService } from "../../services/empresa/empresa-config.service";

export const EmpresaConfigController = {
  async getConfig(req: Request, res: Response) {
    const empresaId = (req as any).user?.id;
    if (!empresaId) return res.status(401).json({ error: "Não autenticado" });
    const config = await EmpresaConfigService.getConfig(empresaId);
    res.json(config);
  },

  async updateConfig(req: Request, res: Response) {
    const empresaId = (req as any).user?.id;
    if (!empresaId) return res.status(401).json({ error: "Não autenticado" });
    const data = req.body;
    const config = await EmpresaConfigService.updateConfig(empresaId, data);
    res.json(config);
  },
};
