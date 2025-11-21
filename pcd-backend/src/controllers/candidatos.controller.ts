import { Request, Response } from "express";
import { CandidatosService } from "../services/candidatos.service";

export const CandidatosController = {
  async criar(req: Request, res: Response) {
    try {
      const contentType = req.headers['content-type'];
      // log para depuração: content-type, body e arquivos recebidos
      console.debug('[CandidatosController] content-type:', contentType);
      console.debug('[CandidatosController] req.body:', req.body);
      console.debug('[CandidatosController] req.files:', (req as any).files);

      // aceitar diferentes nomes de campo vindos do frontend (defensive)
      const body = req.body ?? {};
      const nome = (body.nome ?? body.nomeCompleto ?? body.name) as string | undefined;
      const cpf = body.cpf as string | undefined;
      const telefone = body.telefone as string | undefined;
      const email = body.email as string | undefined;
      const escolaridade = body.escolaridade as string | undefined;
      const senha = body.senha as string | undefined;
      // quando usamos upload.fields, multer coloca os arquivos em req.files como
      // { file?: [File], laudo?: [File] }
      const files = (req as any).files ?? {};
      const fileObj = Array.isArray(files.file) ? files.file[0] : undefined;
      const laudoObj = Array.isArray(files.laudo) ? files.laudo[0] : undefined;

      const curriculoPath = fileObj ? `tmp/${fileObj.filename}` : undefined;
      const laudoPath = laudoObj ? `tmp/${laudoObj.filename}` : undefined;

      const nomeVal = nome ?? '';
      const c = await CandidatosService.criarCandidato({ nome: nomeVal, cpf, telefone, email, escolaridade, senha, curriculo: curriculoPath, laudo: laudoPath });
      res.status(201).json(c);
    } catch (e: any) {
      res.status(e.status || 400).json({ error: e.message ?? 'Erro ao criar candidato' });
    }
  },
  async getCandidato(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await CandidatosService.getCandidato(id);
    res.json(data);
  },

  async listarSubtipos(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = await CandidatosService.listarSubtipos(id);
    res.json(data);
  },

  async vincularSubtipos(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { subtipoIds } = req.body ?? {};
    const result = await CandidatosService.vincularSubtipos(id, subtipoIds);
    res.json(result);
  },

  async vincularBarreiras(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const subtipoId = Number(req.params.subtipoId);
    const { barreiraIds } = req.body ?? {};
    const result = await CandidatosService.vincularBarreiras(candidatoId, subtipoId, barreiraIds);
    res.json(result);
  },
};
