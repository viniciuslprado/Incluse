import { Request, Response } from 'express';

export const adminJobsController = {
  async list(req: Request, res: Response) {

    return res.json({ vagas: [], total: 0 });
  },
  async updateStatus(req: Request, res: Response) {

    return res.json({ success: true });
  },
};
