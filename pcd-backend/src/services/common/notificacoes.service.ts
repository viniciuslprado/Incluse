import { NotificacoesRepo } from "../../repositories/common/notificacoes.repo";
import { sendNotificationEmail } from "./email.service";

export const NotificacoesService = {
  async listarNotificacoes(candidatoId: number, filters: any) {
    const { page, limit } = filters;
    const notificacoes = await NotificacoesRepo.getNotificacoes(candidatoId, page, limit);
    const total = await NotificacoesRepo.countNotificacoes(candidatoId);
    const naoLidas = await NotificacoesRepo.countNaoLidas(candidatoId);
    
    return {
      data: notificacoes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      naoLidas
    };
  },

  async marcarComoLida(candidatoId: number, notifId: number) {
    const notif = await NotificacoesRepo.findById(notifId);
    if (!notif || notif.candidatoId !== candidatoId) {
      throw new Error("Notificação não encontrada");
    }
    
    return NotificacoesRepo.marcarLida(notifId);
  },

  async marcarTodasComoLidas(candidatoId: number) {
    return NotificacoesRepo.marcarTodasLidas(candidatoId);
  },

  async obterConfiguracoes(candidatoId: number) {
    return NotificacoesRepo.getConfiguracoes(candidatoId);
  },

  async atualizarConfiguracoes(candidatoId: number, data: any) {
    return NotificacoesRepo.updateConfiguracoes(candidatoId, data);
  },

  // Métodos para criar notificações (chamados internamente)
  async criarNotificacaoNovaVaga(candidatoId: number, vagaId: number, vagaTitulo: string) {
    const config = await NotificacoesRepo.getConfiguracoes(candidatoId);
    
    // Notificação no app
    if (config?.appNovasVagas) {
      await NotificacoesRepo.criarNotificacao({
        candidatoId,
        vagaId,
        tipo: 'nova_vaga',
        titulo: 'Nova vaga compatível',
        mensagem: `A vaga "${vagaTitulo}" é compatível com seu perfil!`
      });
    }

    // Notificação por email
    if (config?.emailNovasVagas) {
      const candidato = await NotificacoesRepo.getCandidato(candidatoId);
      if (candidato?.email) {
        await sendNotificationEmail({
          to: candidato.email,
          subject: 'Nova vaga compatível disponível',
          title: 'Nova vaga compatível',
          message: `Olá ${candidato.nome}! A vaga "${vagaTitulo}" é compatível com seu perfil e pode ser uma ótima oportunidade para você.`,
          actionUrl: `${process.env.APP_BASE_URL || 'http://localhost:5173'}/vagas/${vagaId}`,
          actionText: 'Ver vaga'
        });
      }
    }
  },

  async criarNotificacaoAtualizacao(candidatoId: number, vagaId: number, vagaTitulo: string, novoStatus: string) {
    const config = await NotificacoesRepo.getConfiguracoes(candidatoId);
    
    const statusTexto = {
      'em_analise': 'em análise',
      'aprovado': 'aprovada',
      'rejeitado': 'rejeitada'
    }[novoStatus] || novoStatus;

    // Notificação no app
    if (config?.appAtualizacoes) {
      await NotificacoesRepo.criarNotificacao({
        candidatoId,
        vagaId,
        tipo: 'atualizacao_candidatura',
        titulo: 'Atualização de candidatura',
        mensagem: `Sua candidatura para "${vagaTitulo}" foi ${statusTexto}.`
      });
    }

    // Notificação por email
    if (config?.emailAtualizacoes) {
      const candidato = await NotificacoesRepo.getCandidato(candidatoId);
      if (candidato?.email) {
        await sendNotificationEmail({
          to: candidato.email,
          subject: `Atualização na sua candidatura - ${vagaTitulo}`,
          title: 'Atualização de candidatura',
          message: `Olá ${candidato.nome}! Sua candidatura para a vaga "${vagaTitulo}" foi ${statusTexto}.`,
          actionUrl: `${process.env.APP_BASE_URL || 'http://localhost:5173'}/candidaturas`,
          actionText: 'Ver candidaturas'
        });
      }
    }
  },

  async criarNotificacaoVagaExpirada(candidatoId: number, vagaId: number, vagaTitulo: string) {
    const config = await NotificacoesRepo.getConfiguracoes(candidatoId);
    
    // Notificação no app
    if (config?.appVagasExpiradas) {
      await NotificacoesRepo.criarNotificacao({
        candidatoId,
        vagaId,
        tipo: 'vaga_expirada',
        titulo: 'Vaga expirada',
        mensagem: `A vaga "${vagaTitulo}" que você salvou foi encerrada.`
      });
    }

    // Notificação por email
    if (config?.emailVagasExpiradas) {
      const candidato = await NotificacoesRepo.getCandidato(candidatoId);
      if (candidato?.email) {
        await sendNotificationEmail({
          to: candidato.email,
          subject: 'Vaga salva foi encerrada',
          title: 'Vaga expirada',
          message: `Olá ${candidato.nome}! A vaga "${vagaTitulo}" que você salvou foi encerrada. Que tal procurar outras oportunidades?`,
          actionUrl: `${process.env.APP_BASE_URL || 'http://localhost:5173'}/vagas`,
          actionText: 'Buscar vagas'
        });
      }
    }
  },
};