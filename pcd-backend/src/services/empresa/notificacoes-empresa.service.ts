import { prisma } from '../../prismaClient';
export const NotificacoesEmpresaService = {
  async listarNotificacoes(empresaId: number, { page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;
    const notificacoes = await prisma.notificacaoEmpresa.findMany({
      where: { empresaId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
    return { notificacoes };
  },

  async marcarComoLida(empresaId: number, notifId: number) {
    await prisma.notificacaoEmpresa.updateMany({
      where: { id: notifId, empresaId },
      data: { lida: true },
    });
  },

  async marcarTodasComoLidas(empresaId: number) {
    await prisma.notificacaoEmpresa.updateMany({
      where: { empresaId, lida: false },
      data: { lida: true },
    });
  },
};
import { EmpresaConfigRepo } from "../../repositories/empresa/empresa-config.repo";

export async function notificarEmpresaNovaCandidatura(empresaId: number, email: string, vagaTitulo: string) {
  // Busca preferências da empresa
  const config = await EmpresaConfigRepo.getConfig(empresaId);
  if (config?.emailNovasCandidaturas && email) {
    const { sendNotificationEmail } = await import("../common/email.service");
    await sendNotificationEmail({
      to: email,
      subject: 'Nova candidatura recebida',
      title: 'Nova candidatura',
      message: `Sua vaga "${vagaTitulo}" recebeu uma nova candidatura!`,
      actionText: 'Ver vaga',
      // actionUrl pode ser customizado conforme a plataforma
    });
  }
  // Aqui pode-se adicionar lógica para notificação in-app se config.appNovasCandidaturas
}
