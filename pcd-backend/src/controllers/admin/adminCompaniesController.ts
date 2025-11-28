import { Request, Response } from 'express';

export const adminCompaniesController = {
  async list(req: Request, res: Response) {
    return res.json({ empresas: [], total: 0 });
  },
  async updateStatus(req: Request, res: Response) {
    return res.json({ success: true });
  },
};
