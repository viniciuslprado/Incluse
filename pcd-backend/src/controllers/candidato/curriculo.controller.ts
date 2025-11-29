import { Request, Response } from "express";
import { CurriculoService } from "../../services/candidato/curriculo.service";

// GET /candidatos/:id/curriculo/download - Download do PDF do currículo

export const CurriculoController = {
  async downloadPdf(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const curriculo = await CurriculoService.obterCurriculo(candidatoId);
      if (!curriculo || !curriculo.curriculo) {
        return res.status(404).json({ error: 'Currículo PDF não encontrado' });
      }
      // Caminho absoluto do arquivo
      const path = require('path');
      const filePath = path.join(process.cwd(), 'pcd-backend', curriculo.curriculo.startsWith('/') ? curriculo.curriculo.substring(1) : curriculo.curriculo);
      return res.download(filePath, `curriculo_${candidatoId}.pdf`);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? 'Erro ao baixar currículo PDF' });
    }
  },

  async obter(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const curriculo = await CurriculoService.obterCurriculo(candidatoId);
      res.json(curriculo);
    } catch (e: any) {
      res.status(500).json({ error: e.message ?? "Erro ao obter currículo" });
    }
  },

  async atualizarDados(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const dados = await CurriculoService.atualizarDadosPessoais(candidatoId, req.body);
      res.json(dados);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar dados" });
    }
  },

  // POST /candidatos/:id/curriculo/experiencias - Adicionar experiência
  async adicionarExperiencia(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const experiencia = await CurriculoService.adicionarExperiencia(candidatoId, req.body);
      res.status(201).json(experiencia);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao adicionar experiência" });
    }
  },

  // PUT /candidatos/:id/curriculo/experiencias/:expId - Atualizar experiência
  async atualizarExperiencia(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const expId = Number(req.params.expId);
      const experiencia = await CurriculoService.atualizarExperiencia(candidatoId, expId, req.body);
      res.json(experiencia);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar experiência" });
    }
  },

  // DELETE /candidatos/:id/curriculo/experiencias/:expId - Remover experiência
  async removerExperiencia(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const expId = Number(req.params.expId);
      await CurriculoService.removerExperiencia(candidatoId, expId);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao remover experiência" });
    }
  },

  // POST /candidatos/:id/curriculo/formacoes - Adicionar formação
  async adicionarFormacao(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const formacao = await CurriculoService.adicionarFormacao(candidatoId, req.body);
      res.status(201).json(formacao);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao adicionar formação" });
    }
  },

  // PUT /candidatos/:id/curriculo/formacoes/:formId - Atualizar formação
  async atualizarFormacao(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const formId = Number(req.params.formId);
      const formacao = await CurriculoService.atualizarFormacao(candidatoId, formId, req.body);
      res.json(formacao);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar formação" });
    }
  },

  // DELETE /candidatos/:id/curriculo/formacoes/:formId - Remover formação
  async removerFormacao(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const formId = Number(req.params.formId);
      await CurriculoService.removerFormacao(candidatoId, formId);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao remover formação" });
    }
  },

  // POST /candidatos/:id/curriculo/cursos - Adicionar curso
  async adicionarCurso(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const curso = await CurriculoService.adicionarCurso(candidatoId, req.body);
      res.status(201).json(curso);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao adicionar curso" });
    }
  },

  // PUT /candidatos/:id/curriculo/cursos/:cursoId - Atualizar curso
  async atualizarCurso(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const cursoId = Number(req.params.cursoId);
      const curso = await CurriculoService.atualizarCurso(candidatoId, cursoId, req.body);
      res.json(curso);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar curso" });
    }
  },

  // DELETE /candidatos/:id/curriculo/cursos/:cursoId - Remover curso
  async removerCurso(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const cursoId = Number(req.params.cursoId);
      await CurriculoService.removerCurso(candidatoId, cursoId);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao remover curso" });
    }
  },

  // POST /candidatos/:id/curriculo/competencias - Adicionar competência
  async adicionarCompetencia(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const competencia = await CurriculoService.adicionarCompetencia(candidatoId, req.body);
      res.status(201).json(competencia);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao adicionar competência" });
    }
  },

  // PUT /candidatos/:id/curriculo/competencias/:compId - Atualizar competência
  async atualizarCompetencia(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const compId = Number(req.params.compId);
      const competencia = await CurriculoService.atualizarCompetencia(candidatoId, compId, req.body);
      res.json(competencia);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar competência" });
    }
  },

  // DELETE /candidatos/:id/curriculo/competencias/:compId - Remover competência
  async removerCompetencia(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const compId = Number(req.params.compId);
      await CurriculoService.removerCompetencia(candidatoId, compId);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao remover competência" });
    }
  },

  // POST /candidatos/:id/curriculo/idiomas - Adicionar idioma
  async adicionarIdioma(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const idioma = await CurriculoService.adicionarIdioma(candidatoId, req.body);
      res.status(201).json(idioma);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao adicionar idioma" });
    }
  },

  // PUT /candidatos/:id/curriculo/idiomas/:idiomaId - Atualizar idioma
  async atualizarIdioma(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const idiomaId = Number(req.params.idiomaId);
      const idioma = await CurriculoService.atualizarIdioma(candidatoId, idiomaId, req.body);
      res.json(idioma);
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao atualizar idioma" });
    }
  },

  // DELETE /candidatos/:id/curriculo/idiomas/:idiomaId - Remover idioma
  async removerIdioma(req: Request, res: Response) {
    try {
      const candidatoId = Number(req.params.id);
      const idiomaId = Number(req.params.idiomaId);
      await CurriculoService.removerIdioma(candidatoId, idiomaId);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message ?? "Erro ao remover idioma" });
    }
  },
};