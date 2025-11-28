import nodemailer from 'nodemailer';

let cachedTransport: nodemailer.Transporter | null = null;

async function createTransport(): Promise<nodemailer.Transporter> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

async function getTransport(): Promise<nodemailer.Transporter> {
  if (cachedTransport) return cachedTransport;
  cachedTransport = await createTransport();
  return cachedTransport;
}

export interface PasswordResetEmailData {
  to: string;
  token: string;
  userType: string;
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  const transport = await getTransport();
  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
  const resetLink = `${baseUrl}/recuperar-senha?token=${encodeURIComponent(data.token)}&tipo=${encodeURIComponent(data.userType)}`;

  const info = await transport.sendMail({
    from: process.env.MAIL_FROM || 'Suporte <no-reply@incluse.local>',
    to: data.to,
    subject: 'Recuperação de senha',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#222">
        <h2 style="color:#0057b8;">Recuperação de senha</h2>
        <p>Você solicitou a recuperação de senha para sua conta (${data.userType}).</p>
        <p>Clique no botão abaixo dentro de <strong>1 hora</strong> para redefinir:</p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${resetLink}" style="background:#0057b8;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Redefinir senha</a>
        </p>
        <p>Se o botão não funcionar, copie e cole este link no navegador:</p>
        <p style="word-break:break-all;font-size:12px;color:#555">${resetLink}</p>
        <hr style="margin:32px 0;border:none;border-top:1px solid #ddd" />
        <small style="color:#666;">Se você não fez esta solicitação, apenas ignore este e-mail.</small>
      </div>
    `,
  });

  logPreviewIfEthereal(info);
}

export interface NotificationEmailData {
  to: string;
  subject: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export async function sendNotificationEmail(data: NotificationEmailData) {
  const transport = await getTransport();
  
  const actionButton = data.actionUrl ? `
    <p style="text-align:center;margin:24px 0;">
      <a href="${data.actionUrl}" style="background:#0057b8;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">${data.actionText || 'Ver detalhes'}</a>
    </p>
  ` : '';

  const info = await transport.sendMail({
    from: process.env.MAIL_FROM || 'PCD Inclusão <no-reply@incluse.local>',
    to: data.to,
    subject: data.subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#222">
        <h2 style="color:#0057b8;">${data.title}</h2>
        <p>${data.message}</p>
        ${actionButton}
        <hr style="margin:32px 0;border:none;border-top:1px solid #ddd" />
        <small style="color:#666;">Você está recebendo este e-mail porque ativou as notificações por e-mail. <a href="${process.env.APP_BASE_URL || 'http://localhost:5173'}/configuracoes">Alterar preferências</a></small>
      </div>
    `,
  });

  logPreviewIfEthereal(info);
}

function logPreviewIfEthereal(info: any) {
  if (!process.env.SMTP_HOST) {
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log('[email.service] Preview URL (Ethereal):', preview);
    }
  }
}
