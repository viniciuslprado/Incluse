import { Request, Response } from 'express';

export const adminCandidatesController = {
  async list(req: Request, res: Response) {
    return res.json({ candidatos: [], total: 0 });
  },
};
