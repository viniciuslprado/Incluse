
import { Request, Response } from "express";
import { CandidatosService } from "../../services/candidato/candidatos.service";
import { MatchService } from "../../services/candidato/match.service";

export const CandidatosController = {
  async obterPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID do candidato ausente ou inválido.' });
    }
    try {
      const candidato = await CandidatosService.getCandidato(id);
      if (!candidato) {
        return res.status(404).json({ error: 'Candidato não encontrado' });
      }
      // Normalização dos campos esperados pelo frontend
      const normalizado = {
        id: candidato.id,
        nome: typeof candidato.nome === 'string' ? candidato.nome : '',
        username: candidato.username ?? '',
        email: candidato.email ?? '',
        telefone: candidato.telefone ?? '',
        cpf: candidato.cpf ?? '',
        rua: candidato.rua ?? '',
        bairro: candidato.bairro ?? '',
        cidade: candidato.cidade ?? '',
        estado: candidato.estado ?? '',
        cep: candidato.cep ?? '',
        escolaridade: candidato.escolaridade ?? '',
        curso: candidato.curso ?? '',
        sobre: candidato.sobre ?? '',
        aceitaMudanca: candidato.aceitaMudanca ?? null,
        aceitaViajar: candidato.aceitaViajar ?? null,
        pretensaoSalarialMin: candidato.pretensaoSalarialMin ?? '',
        areasFormacao: Array.isArray(candidato.areasFormacao) ? candidato.areasFormacao.map((a: any) => ({ id: a.areaId ?? a.id, nome: a.area?.nome ?? a.nome ?? '' })) : [],
        subtipos: Array.isArray(candidato.subtipos) ? candidato.subtipos : [],
        barras: Array.isArray(candidato.barras) ? candidato.barras : [],
        curriculo: candidato.curriculo ?? '',
        laudo: candidato.laudo ?? '',
        isActive: candidato.isActive ?? true,
        createdAt: candidato.createdAt,
        updatedAt: candidato.updatedAt,
      };
      res.json(normalizado);
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message || "Erro ao buscar candidato" });
    }
  },
  async listarAreasFormacao(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido" });
    const areas = await CandidatosService.listarAreasFormacao(id);
    res.json(areas);
  },
  async getLaudo(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const candidato = await CandidatosService.getCandidato(id);
      if (!candidato || !candidato.laudo) return res.status(404).json({ error: 'Laudo não encontrado' });
      // Retorna apenas a URL do laudo (privacidade)
      res.json({ laudo: candidato.laudo });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? 'Erro ao buscar laudo' });
    }
  },

  async excluirLaudo(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id || isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      await CandidatosService.updateLaudo(id, null);
      res.json({ ok: true, message: 'Laudo excluído com sucesso' });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? 'Erro ao excluir laudo' });
    }
  },
  async criar(req: Request, res: Response) {
    try {
      const contentType = req.headers['content-type'];

      console.log('[CandidatosController] content-type:', contentType);
      console.log('[CandidatosController] req.body:', req.body);
      console.log('[CandidatosController] req.files:', (req as any).files);


      const body = req.body ?? {};
      const nome = (body.nome ?? body.nomeCompleto ?? body.name) as string | undefined;
      // Normaliza CPF e telefone para conter apenas números
      const cpf = typeof body.cpf === 'string' ? body.cpf.replace(/\D/g, '') : undefined;
      const telefone = typeof body.telefone === 'string' ? body.telefone.replace(/\D/g, '') : undefined;
      const email = body.email as string | undefined;
      const escolaridade = body.escolaridade as string | undefined;
      const senha = body.senha as string | undefined;

      const files = (req as any).files ?? {};
      const fileObj = Array.isArray(files.file) ? files.file[0] : undefined;
      const laudoObj = Array.isArray(files.laudo) ? files.laudo[0] : undefined;

      const curriculoPath = fileObj ? `/uploads/${fileObj.filename}` : undefined;
      const laudoPath = laudoObj ? `/uploads/${laudoObj.filename}` : undefined;

      const nomeVal = nome ?? '';
      console.log('[CandidatosController] dados para criar:', { nome: nomeVal, cpf, telefone, email, escolaridade, senha: senha ? '***' : undefined, curriculo: curriculoPath, laudo: laudoPath });
      
      if (!nomeVal.trim()) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }
      if (!senha || senha.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
      }
      
      const c = await CandidatosService.criarCandidato({ nome: nomeVal, cpf, telefone, email, escolaridade, senha, curriculo: curriculoPath, laudo: laudoPath });
      res.status(201).json(c);
    } catch (e: any) {
      console.error('[CandidatosController] erro ao criar candidato:', e);
      console.error('[CandidatosController] stack:', e.stack);

      if (e && e.code === 'P2002') {
        const target = String(e.meta?.target || 'campo');
        if (target.toLowerCase().includes('cpf')) {
          return res.status(400).json({ error: 'Já existe uma conta cadastrada neste CPF' });
        }
        if (target.toLowerCase().includes('email')) {
          return res.status(400).json({ error: 'Já existe uma conta cadastrada neste e-mail' });
        }
        if (target.toLowerCase().includes('id')) {
          return res.status(400).json({ error: 'Já existe um registro semelhante cadastrado. Tente atualizar ou revise os dados enviados.' });
        }
        return res.status(400).json({ error: `Conflito de unicidade: ${target}` });
      }

      const rawMessage = String(e?.message ?? 'Erro ao criar candidato');

      const msgLower = rawMessage.toLowerCase();
      let userMessage = rawMessage;
      if (msgLower.includes('nome é obrigatório')) userMessage = 'O campo Nome não foi preenchido';
      else if (msgLower.includes('senha inválida')) userMessage = 'A senha é inválida (mínimo 6 caracteres)';
      else if (msgLower.includes('cpf inválido')) userMessage = 'CPF inválido. Deve conter 11 dígitos.';
      else if (msgLower.includes('e-mail já cadastrado') || msgLower.includes('email já cadastrado')) userMessage = 'Já existe uma conta cadastrada neste e-mail';
      else if (msgLower.includes('cpf já cadastrado')) userMessage = 'Já existe uma conta cadastrada neste CPF';

      const payload: any = { error: userMessage };
      if (process.env.NODE_ENV !== 'production') {
        payload.original = e;
      }
      res.status(e.status || 400).json(payload);
    }
  },
  // GET /candidato/:id/inicio - Dados do candidato + vagas recomendadas (match)
  async getCandidato(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID do candidato ausente ou inválido.' });
    }
    try {
      // Importação dinâmica para evitar erro de importação circular
      const vagasRecomendadas = await MatchService.matchVagasForCandidato(id);
      res.json({ vagasRecomendadas });
    } catch (e: any) {
      res.status(e.status || 500).json({ error: e.message || "Erro ao buscar candidato" });
    }
  },

  async listarSubtipos(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID do candidato ausente ou inválido.' });
    }
    const data = await CandidatosService.listarSubtipos(id);
    res.json(data);
  },

  async vincularSubtipos(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID do candidato ausente ou inválido.' });
    }
    const { subtipoIds } = req.body ?? {};
    const result = await CandidatosService.vincularSubtipos(id, subtipoIds);
    res.json(result);
  },

  async vincularBarreiras(req: Request, res: Response) {
    const candidatoId = Number(req.params.id);
    const subtipoId = Number(req.params.subtipoId);
    if (!candidatoId || isNaN(candidatoId)) {
      return res.status(400).json({ error: 'ID do candidato ausente ou inválido.' });
    }
    if (!subtipoId || isNaN(subtipoId)) {
      return res.status(400).json({ error: 'ID do subtipo ausente ou inválido.' });
    }
    const { barreiraIds } = req.body ?? {};
    const result = await CandidatosService.vincularBarreiras(candidatoId, subtipoId, barreiraIds);
    res.json(result);
  },

  async checkCpf(req: Request, res: Response) {
    try {
      const cpf = String(req.params.cpf).replace(/\D/g, '');
      const exists = await CandidatosService.checkCpfExists(cpf);
      res.json({ exists });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Erro ao verificar CPF' });
    }
  },

  async checkEmail(req: Request, res: Response) {
    try {
      const email = String(req.params.email);
      const exists = await CandidatosService.checkEmailExists(email);
      res.json({ exists });
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Erro ao verificar e-mail' });
    }
  },

  // POST /candidatos/curriculo - Upload de currículo
  async uploadCurriculo(req: Request, res: Response) {
    try {
      const candidatoId = (req as any).user?.id;
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      
      const curriculoUrl = `/uploads/curriculos/${req.file.filename}`;
      await CandidatosService.updateCurriculo(candidatoId, curriculoUrl);
      
      res.json({ curriculoUrl, message: "Currículo anexado com sucesso" });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao fazer upload do currículo" });
    }
  },

  // POST /candidatos/:id/favoritos/:vagaId - Favoritar vaga
  async favoritarVaga(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const vagaId = Number(req.params.vagaId);
      const favorito = await CandidatosService.favoritarVaga(candidatoId, vagaId);
      res.status(201).json(favorito);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao favoritar vaga" });
    }
  },

  // DELETE /candidatos/:id/favoritos/:vagaId - Desfavoritar vaga
  async desfavoritarVaga(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const vagaId = Number(req.params.vagaId);
      await CandidatosService.desfavoritarVaga(candidatoId, vagaId);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao desfavoritar vaga" });
    }
  },

  // GET /candidatos/:id/favoritos - Listar vagas favoritas
  async listarFavoritos(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const favoritos = await CandidatosService.listarVagasFavoritas(candidatoId);
      res.json(favoritos);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao listar favoritos" });
    }
  },

  // PUT /candidatos/:id - Atualizar candidato
  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const candidato = await CandidatosService.atualizarCandidato(id, req.body);
      res.json(candidato);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar candidato" });
    }
  },

  // DELETE /candidatos/:id - Excluir conta do candidato
  async excluirConta(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await CandidatosService.excluirCandidato(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao excluir conta" });
    }
  },

  // PATCH /candidatos/:id/desativar - Desativar conta do candidato
  async desativarConta(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await CandidatosService.desativarCandidato(id);
      res.json({ ok: true, message: 'Conta desativada com sucesso' });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao desativar conta" });
    }
  },

  // PATCH /candidatos/:id/reativar - Reativar conta do candidato
  async reativarConta(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await CandidatosService.reativarCandidato(id);
      res.json({ ok: true, message: 'Conta reativada com sucesso' });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao reativar conta" });
    }
  },

  // POST /candidatos/laudo/upload - Upload de laudo médico
  async uploadLaudo(req: Request, res: Response) {
    try {
      const candidatoId = (req as any).user?.id;
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      const laudoUrl = `/uploads/laudos/${req.file.filename}`;
      // Atualize o candidato com o novo laudo, se necessário
      await CandidatosService.updateLaudo(candidatoId, laudoUrl);
      res.json({ laudoUrl, message: "Laudo médico anexado com sucesso" });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao fazer upload do laudo médico" });
    }
  },

  // POST /candidatos/foto/upload - Upload de foto de perfil
  async uploadFoto(req: Request, res: Response) {
    try {
      const candidatoId = (req as any).user?.id;
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      const fotoUrl = `/uploads/fotos/${req.file.filename}`;
      // Atualize o candidato com a nova foto, se necessário
      await CandidatosService.updateFoto(candidatoId, fotoUrl);
      res.json({ fotoUrl, message: "Foto de perfil anexada com sucesso" });
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao fazer upload da foto de perfil" });
    }
  },
};
