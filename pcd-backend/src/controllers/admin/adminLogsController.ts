import { Request, Response } from 'express';

export const adminLogsController = {
  async list(req: Request, res: Response) {

    return res.json({ logs: [], total: 0 });
  },
};
