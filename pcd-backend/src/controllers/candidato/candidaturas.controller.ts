import { Request, Response } from "express";
import prisma from "../../prismaClient";
import { NotificacoesService } from "../../services/common/notificacoes.service";

export class CandidaturasController {
  static async criar(req: Request, res: Response) {
    const vagaId = Number(req.params.id);
    const { candidatoId } = req.body;
    
    console.log('[CandidaturasController.criar] ====== INÍCIO ======');
    console.log('[CandidaturasController.criar] req.params:', req.params);
    console.log('[CandidaturasController.criar] req.body:', req.body);
    console.log('[CandidaturasController.criar] vagaId:', vagaId, 'candidatoId:', candidatoId);
    console.log('[CandidaturasController.criar] vagaId type:', typeof vagaId, 'candidatoId type:', typeof candidatoId);
    
    if (!vagaId || !candidatoId) {
      console.log('[CandidaturasController.criar] Dados inválidos - retornando erro 400');
      return res.status(400).json({ error: "Dados inválidos" });
    }
    
    try {
      console.log('[CandidaturasController.criar] Verificando candidatura existente...');

      const existingActive = await prisma.candidatura.findFirst({
        where: { 
          vagaId, 
          candidatoId: Number(candidatoId), 
          isActive: true 
        }
      });
      
      console.log('[CandidaturasController.criar] Candidatura existente:', existingActive);
      
      if (existingActive) {
        console.log('[CandidaturasController.criar] Candidatura já ativa - retornando erro');
        return res.status(400).json({ error: "Você já se candidatou a esta vaga" });
      }
      
      console.log('[CandidaturasController.criar] Buscando vaga...');
      // Verificar se a vaga existe
      const vaga = await prisma.vaga.findUnique({
        where: { id: vagaId }
      });
      
      console.log('[CandidaturasController.criar] Vaga encontrada:', vaga ? { id: vaga.id, titulo: vaga.titulo, isActive: vaga.isActive, status: vaga.status } : null);
      
      if (!vaga) {
        console.log('[CandidaturasController.criar] Vaga não encontrada - retornando erro 404');
        return res.status(404).json({ error: "Vaga não encontrada" });
      }
      
      const statusInicial = (!vaga.isActive || vaga.status !== 'ativa') ? 'dispensado' : 'pendente';
      console.log('[CandidaturasController.criar] Status inicial definido:', statusInicial);
      
      console.log('[CandidaturasController.criar] Chamando upsert com:', { vagaId, candidatoId: Number(candidatoId), statusInicial });
      
      const created = await prisma.candidatura.upsert({
        where: {
          vagaId_candidatoId: {
            vagaId,
            candidatoId: Number(candidatoId)
          }
        },
        update: {
          isActive: true,
          status: statusInicial,
          updatedAt: new Date()
        },
        create: {
          vagaId,
          candidatoId: Number(candidatoId),
          status: statusInicial,
          isActive: true
        }
      });
      
      console.log('[CandidaturasController.criar] Candidatura processada:', JSON.stringify(created, null, 2));
      
      // Verificar imediatamente após criar
      const verificacao = await prisma.candidatura.findFirst({
        where: { vagaId, candidatoId: Number(candidatoId), isActive: true }
      });
      console.log('[CandidaturasController.criar] Verificação imediata:', JSON.stringify(verificacao, null, 2));
      
      return res.status(201).json({ id: created.id, vagaId: created.vagaId, candidatoId: created.candidatoId });
    } catch (err: any) {
      console.error('[CandidaturasController.criar] Erro:', err);
      // Se for erro de constraint única, significa que já existe candidatura ativa
      if (err.code === 'P2002') {
        return res.status(400).json({ error: "Você já se candidatou a esta vaga" });
      }
      return res.status(500).json({ error: err?.message ?? 'Erro ao registrar candidatura' });
    }
  }

  static async listarPorCandidato(req: Request, res: Response) {
    const candidatoId = Number(req.params.id || req.params.candidatoId);
    const { status, periodo } = req.query;
    
    if (!candidatoId) return res.status(400).json({ error: "ID do candidato inválido" });
    
    try {
      // DIAGNÓSTICO: Verificar TODAS as candidaturas deste candidato (sem filtro)
      const todasCandidaturas = await prisma.candidatura.findMany({
        where: { candidatoId },
        select: { id: true, status: true, isActive: true, vagaId: true, createdAt: true }
      });
      console.log('[CandidaturasController.listarPorCandidato] TODAS candidaturas (sem filtro):', todasCandidaturas);
      
      let whereClause: any = { candidatoId };
      
      if (status && status !== 'todos') {
        whereClause.status = status;
      }
      
      if (periodo) {
        const now = new Date();
        let dateFilter: Date;
        
        switch (periodo) {
          case '30':
            dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '90':
            dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            dateFilter = new Date(0);
        }
        
        whereClause.createdAt = { gte: dateFilter };
      }
      
      // Filtrar apenas candidaturas ativas (não retiradas)
      whereClause.isActive = true;
      
      console.log('[CandidaturasController.listarPorCandidato] candidatoId:', candidatoId);
      console.log('[CandidaturasController.listarPorCandidato] whereClause:', JSON.stringify(whereClause, null, 2));
      
      const candidaturas = await prisma.candidatura.findMany({
        where: whereClause,
        include: {
          vaga: {
            select: {
              id: true,
              titulo: true,
              modeloTrabalho: true,
              localizacao: true,
              empresa: { select: { id: true, nome: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log('[CandidaturasController.listarPorCandidato] candidaturas encontradas:', candidaturas.length);
      if (candidaturas.length > 0) {
        console.log('[CandidaturasController.listarPorCandidato] primeira candidatura:', JSON.stringify(candidaturas[0], null, 2));
      }
      
      // Transformar os dados para o formato esperado pelo frontend
       const candidaturasFormatadas = candidaturas.map((c: any) => ({
        id: c.id,
        status: c.status,
        createdAt: c.createdAt,
        vaga: {
          id: c.vaga.id,
          titulo: c.vaga.titulo,
          empresa: c.vaga.empresa,
          modeloTrabalho: c.vaga.modeloTrabalho || 'Não informado',
          localizacao: c.vaga.localizacao || 'Não informado'
        }
      }));
      
      console.log('[CandidaturasController.listarPorCandidato] retornando:', candidaturasFormatadas.length, 'candidaturas');
      return res.json(candidaturasFormatadas);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err?.message ?? 'Erro ao listar candidaturas' });
    }
  }

  static async obterDashboard(req: Request, res: Response) {
    const candidatoId = Number(req.params.id || req.params.candidatoId);
    
    if (!candidatoId) return res.status(400).json({ error: "ID do candidato inválido" });
    
    try {
      const stats = await prisma.candidatura.groupBy({
        by: ['status'],
        where: { candidatoId, isActive: true },
        _count: { status: true }
      });
      
      const dashboard = {
        candidaturasEnviadas: 0,
        emAnalise: 0,
        preSelecionado: 0,
        entrevistaMarcada: 0
      };
      
      // Total de candidaturas enviadas é a soma de todos os status
      dashboard.candidaturasEnviadas = stats.reduce((total, stat) => total + stat._count.status, 0);
      
      stats.forEach(stat => {
        const count = stat._count.status;
        switch (stat.status) {
          case 'em_analise':
            dashboard.emAnalise += count;
            break;
          case 'pre_selecionado':
            dashboard.preSelecionado += count;
            break;
          case 'entrevista_marcada':
            dashboard.entrevistaMarcada += count;
            break;
        }
      });
      
      return res.json(dashboard);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err?.message ?? 'Erro ao obter dashboard' });
    }
  }

  static async retirarCandidatura(req: Request, res: Response) {
    const vagaId = Number(req.params.vagaId);
    const candidatoId = Number(req.params.candidatoId);
    
    console.log('[CandidaturasController.retirarCandidatura] vagaId:', vagaId, 'candidatoId:', candidatoId);
    
    if (!vagaId || !candidatoId) return res.status(400).json({ error: "Dados inválidos" });
    
    try {
      const candidatura = await prisma.candidatura.findFirst({
        where: { vagaId, candidatoId, isActive: true }
      });
      
      if (!candidatura) {
        console.log('[CandidaturasController.retirarCandidatura] Candidatura não encontrada');
        return res.status(404).json({ error: "Candidatura não encontrada" });
      }
      
      // Marcar como inativa ao invés de deletar
      await prisma.candidatura.update({
        where: { id: candidatura.id },
        data: { isActive: false, updatedAt: new Date() }
      });
      
      console.log('[CandidaturasController.retirarCandidatura] Candidatura retirada com sucesso');
      return res.json({ message: "Candidatura retirada com sucesso" });
    } catch (err: any) {
      console.error('[CandidaturasController.retirarCandidatura] Erro:', err);
      return res.status(500).json({ error: err?.message ?? 'Erro ao retirar candidatura' });
    }
  }

  // Método para marcar candidaturas como dispensado quando vaga for desativada
  static async marcarCandidaturasComoDispensado(vagaId: number, vagaTitulo: string) {
    try {
      // Buscar todas as candidaturas ativas para esta vaga
      const candidaturas = await prisma.candidatura.findMany({
        where: { 
          vagaId, 
          isActive: true,
          status: { in: ['pendente', 'em_analise'] } // Apenas pendentes e em análise
        },
        include: { candidato: true }
      });

      // Atualizar status para dispensado
      await prisma.candidatura.updateMany({
        where: { 
          vagaId, 
          isActive: true,
          status: { in: ['pendente', 'em_analise'] }
        },
        data: { status: 'dispensado' }
      });

      // Enviar notificações para os candidatos
      for (const candidatura of candidaturas) {
        try {
          await NotificacoesService.criarNotificacaoAtualizacao(
            candidatura.candidatoId,
            vagaId,
            vagaTitulo,
            'dispensado'
          );
        } catch (notifErr) {
          console.error('Erro ao enviar notificação:', notifErr);
        }
      }

      console.log(`[CandidaturasController] ${candidaturas.length} candidaturas marcadas como dispensado para vaga ${vagaId}`);
    } catch (err: any) {
      console.error('[CandidaturasController] Erro ao marcar candidaturas como dispensado:', err);
    }
  }

  static async verificarCandidatura(req: Request, res: Response) {
    const vagaId = Number(req.params.vagaId);
    const candidatoId = Number(req.params.candidatoId);
    
    console.log('[CandidaturasController.verificarCandidatura] vagaId:', vagaId, 'candidatoId:', candidatoId);
    console.log('[CandidaturasController.verificarCandidatura] Tipos:', typeof vagaId, typeof candidatoId);
    
    if (!vagaId || !candidatoId) return res.status(400).json({ error: "Dados inválidos" });
    
    try {
      // Buscar TODAS as candidaturas deste candidato e vaga (debug)
      const todasCandidaturas = await prisma.candidatura.findMany({
        where: { vagaId, candidatoId }
      });
      console.log('[CandidaturasController.verificarCandidatura] TODAS candidaturas:', JSON.stringify(todasCandidaturas, null, 2));
      
      const candidatura = await prisma.candidatura.findFirst({
        where: { vagaId, candidatoId, isActive: true }
      });
      
      console.log('[CandidaturasController.verificarCandidatura] Candidatura encontrada:', candidatura);
      
      const applied = !!candidatura;
      console.log('[CandidaturasController.verificarCandidatura] Applied:', applied);
      
      return res.json({ applied });
    } catch (err: any) {
      console.error('[CandidaturasController.verificarCandidatura] Erro:', err);
      return res.status(500).json({ error: err?.message ?? 'Erro ao verificar candidatura' });
    }
  }
}
