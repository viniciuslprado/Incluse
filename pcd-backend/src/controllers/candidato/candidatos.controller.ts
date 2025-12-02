
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
      // Normalização dos campos esperados pelo frontend, garantindo arrays e subcampos
      const c: any = candidato as any;
      const normalizado = {
        id: c.id,
        nome: typeof c.nome === 'string' ? c.nome : '',
        username: c.username ?? '',
        email: c.email ?? '',
        telefone: c.telefone ?? '',
        cpf: c.cpf ?? '',
        rua: c.rua ?? '',
        bairro: c.bairro ?? '',
        cidade: c.cidade ?? '',
        estado: c.estado ?? '',
        cep: c.cep ?? '',
        escolaridade: c.escolaridade ?? '',
        curso: c.curso ?? '',
        sobre: c.sobre ?? '',
        aceitaMudanca: c.aceitaMudanca ?? null,
        aceitaViajar: c.aceitaViajar ?? null,
        pretensaoSalarialMin: c.pretensaoSalarialMin ?? '',
        areasFormacao: Array.isArray(c.areasFormacao) ? c.areasFormacao.map((a: any) => ({ id: a.areaId ?? a.id, nome: a.area?.nome ?? a.nome ?? '' })) : [],
        subtipos: Array.isArray(c.subtipos) ? c.subtipos.map((s: any) => ({
          id: s.subtipoId ?? s.id,
          nome: s.subtipo?.nome ?? s.nome ?? '',
          tipoId: s.subtipo?.tipoId ?? null,
          ...s.subtipo
        })) : [],
        barras: Array.isArray(c.barras) ? c.barras.map((b: any) => ({
          id: b.barreiraId ?? b.id,
          descricao: b.barreira?.descricao ?? b.descricao ?? '',
          subtipoId: b.subtipoId ?? null,
          ...b.barreira
        })) : [],
        curriculo: c.curriculo ?? '',
        laudo: c.laudo ?? '',
        isActive: c.isActive ?? true,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        experiencias: Array.isArray(c.experiencias) ? c.experiencias.map((exp: any) => ({
          id: exp.id,
          cargo: exp.cargo ?? '',
          empresa: exp.empresa ?? '',
          dataInicio: exp.dataInicio ?? '',
          dataTermino: exp.dataTermino ?? '',
          atualmenteTrabalha: exp.atualmenteTrabalha ?? false,
          descricao: exp.descricao ?? ''
        })) : [],
        formacoes: Array.isArray(c.formacoes) ? c.formacoes.map((f: any) => ({
          id: f.id,
          escolaridade: f.escolaridade ?? '',
          instituicao: f.instituicao ?? '',
          curso: f.curso ?? '',
          situacao: f.situacao ?? '',
          inicio: f.inicio ?? '',
          termino: f.termino ?? '',
          anoConclusao: f.anoConclusao ?? ''
        })) : [],
        cursos: Array.isArray(c.cursos) ? c.cursos.map((curs: any) => ({
          id: curs.id,
          nome: curs.nome ?? '',
          instituicao: curs.instituicao ?? '',
          cargaHoraria: curs.cargaHoraria ?? '',
          certificado: curs.certificado ?? ''
        })) : [],
        competencias: Array.isArray(c.competencias) ? c.competencias.map((comp: any) => ({
          id: comp.id,
          tipo: comp.tipo ?? '',
          nome: comp.nome ?? '',
          nivel: comp.nivel ?? ''
        })) : [],
        idiomas: Array.isArray(c.idiomas) ? c.idiomas.map((idi: any) => ({
          id: idi.id,
          idioma: idi.idioma ?? '',
          nivel: idi.nivel ?? '',
          certificado: idi.certificado ?? ''
        })) : [],
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
      await CandidatosService.updateLaudo(id, '');
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

      // Após criação, aceitar vinculação opcional de subtipos/barreiras enviados no formulário
      // Suporta vários formatos (multipart/form-data envia strings):
      // - 'subtipoIds' como JSON string ou array de ids
      // - 'subtipoId' único + 'barreiraIds' como JSON string ou array
      // - 'barreirasBySubtipo' como JSON string no formato { "<subtipoId>": [id,...], ... }
      try {
        const bodyAny: any = body as any;

        // Helper para normalizar campos que podem vir como string JSON ou array
        const parsePossibleArray = (v: any): number[] => {
          if (!v) return [];
          if (Array.isArray(v)) return v.map(Number).filter(n => !isNaN(n));
          if (typeof v === 'string') {
            try {
              const parsed = JSON.parse(v);
              if (Array.isArray(parsed)) return parsed.map(Number).filter(n => !isNaN(n));
            } catch (_) {
              // fallback: comma separated
              return v.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
            }
          }
          return [];
        };

        // vincular subtipos se fornecido
        const subtipoIds = parsePossibleArray(bodyAny.subtipoIds ?? bodyAny.subtipos);
        if (subtipoIds.length > 0) {
          await CandidatosService.vincularSubtipos(c.id, subtipoIds);
        }

        // vincular barreiras: vários formatos
        // 1) barreiraIds + subtipoId (único)
        const barreiraIdsSingle = parsePossibleArray(bodyAny.barreiraIds ?? bodyAny.selectedBarreiras ?? bodyAny.barreiras);
        const subtipoIdSingle = bodyAny.subtipoId ? Number(bodyAny.subtipoId) : undefined;
        if (subtipoIdSingle && barreiraIdsSingle.length > 0) {
          await CandidatosService.vincularBarreiras(c.id, Number(subtipoIdSingle), barreiraIdsSingle);
        }

        // 2) barreirasBySubtipo: objeto JSON string mapping subtipoId -> array of barreiraIds
        if (bodyAny.barreirasBySubtipo) {
          try {
            const parsed = typeof bodyAny.barreirasBySubtipo === 'string' ? JSON.parse(bodyAny.barreirasBySubtipo) : bodyAny.barreirasBySubtipo;
            if (parsed && typeof parsed === 'object') {
              for (const key of Object.keys(parsed)) {
                const sid = Number(key);
                if (isNaN(sid)) continue;
                const list = Array.isArray(parsed[key]) ? parsed[key].map(Number).filter((n: any) => !isNaN(n)) : [];
                if (list.length > 0) {
                  await CandidatosService.vincularBarreiras(c.id, sid, list);
                }
              }
            }
          } catch (e) {
            // ignora erros de parse
          }
        }
      } catch (e) {
        // não falhar o cadastro se a vinculação falhar; apenas log para debug
        console.error('[CandidatosController] erro ao vincular subtipos/barreiras após criação:', e);
      }

      res.status(201).json(c);
    } catch (e: any) {
      console.error('[CandidatosController] erro ao criar candidato:', e);
      console.error('[CandidatosController] stack:', e.stack);

      if (e && e.code === 'P2002') {
        const metaTarget = e.meta?.target;
        let targets: string[] = [];
        if (Array.isArray(metaTarget)) targets = metaTarget.map((t: any) => String(t).toLowerCase());
        else if (typeof metaTarget === 'string') targets = [metaTarget.toLowerCase()];

        if (targets.some(t => t.includes('cpf'))) {
          return res.status(400).json({ error: 'Já existe uma conta cadastrada neste CPF' });
        }
        if (targets.some(t => t.includes('email'))) {
          return res.status(400).json({ error: 'Já existe uma conta cadastrada neste e-mail' });
        }
        // fallback: return a clearer duplicate message including target(s)
        const joined = targets.length ? targets.join(', ') : String(metaTarget || 'campo');
        return res.status(400).json({ error: `Registro duplicado (campo: ${joined}). Tente atualizar ou revise os dados enviados.` });
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
