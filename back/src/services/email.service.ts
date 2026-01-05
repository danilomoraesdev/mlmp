import nodemailer from "nodemailer";
import type { SendMailOptions, Transporter } from "nodemailer";

// Configuração lazy do transporter (garante que as variáveis de ambiente estejam carregadas)
let transporter: Transporter | null = null;

const getTransporter = (): Transporter => {
  if (transporter) {
    return transporter;
  }

  // Em desenvolvimento, use Ethereal (fake SMTP) ou configure SMTP real
  if (process.env.NODE_ENV === "development" && !process.env.SMTP_HOST) {
    // Retorna um transporter que loga no console em dev
    transporter = nodemailer.createTransport({
      jsonTransport: true, // Retorna o e-mail como JSON ao invés de enviar
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
};

// Configurações padrão
const defaultFromEmail = process.env.MAIL_FROM || "noreply@example.com";
const defaultFromName = process.env.MAIL_FROM_NAME || "MLMP App";

// Interface para opções de e-mail
interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
  attachments?: SendMailOptions["attachments"];
}

// Resultado do envio
interface EmailResult {
  success: boolean;
  messageId?: string;
  preview?: string; // URL para preview no Ethereal
  error?: string;
}

export const emailService = {
  /**
   * Enviar e-mail
   */
  async send(options: EmailOptions): Promise<EmailResult> {
    try {
      const mailOptions: SendMailOptions = {
        from: options.from || `"${defaultFromName}" <${defaultFromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo,
        attachments: options.attachments,
      };

      const info = await getTransporter().sendMail(mailOptions);

      // Em desenvolvimento com jsonTransport, loga o e-mail
      if (process.env.NODE_ENV === "development" && !process.env.SMTP_HOST) {
        console.log("📧 E-mail (dev mode):", JSON.parse(info.message));
      }

      return {
        success: true,
        messageId: info.messageId,
        preview: nodemailer.getTestMessageUrl(info) || undefined,
      };
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  },

  /**
   * Enviar e-mail de boas-vindas
   */
  async sendWelcome(to: string, name: string): Promise<EmailResult> {
    return this.send({
      to,
      subject: "Bem-vindo ao MLMP!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Olá, ${name}! 👋</h1>
          <p>Seja bem-vindo ao MLMP!</p>
          <p>Sua conta foi criada com sucesso.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Este é um e-mail automático, por favor não responda.
          </p>
        </div>
      `,
    });
  },

  /**
   * Enviar e-mail de reset de senha
   */
  async sendPasswordReset(to: string, resetUrl: string): Promise<EmailResult> {
    return this.send({
      to,
      subject: "Redefinição de senha",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Redefinição de Senha</h1>
          <p>Você solicitou a redefinição da sua senha.</p>
          <p>Clique no botão abaixo para criar uma nova senha:</p>
          <a href="${resetUrl}" style="
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          ">Redefinir Senha</a>
          <p style="color: #666;">
            Se você não solicitou esta redefinição, ignore este e-mail.
          </p>
          <p style="color: #666;">
            Este link expira em 1 hora.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Se o botão não funcionar, copie e cole este link no navegador:<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
      `,
    });
  },

  /**
   * Enviar e-mail de verificação
   */
  async sendEmailVerification(
    to: string,
    verifyUrl: string
  ): Promise<EmailResult> {
    return this.send({
      to,
      subject: "Verifique seu e-mail",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Verificação de E-mail</h1>
          <p>Clique no botão abaixo para verificar seu e-mail:</p>
          <a href="${verifyUrl}" style="
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          ">Verificar E-mail</a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Se o botão não funcionar, copie e cole este link no navegador:<br>
            <a href="${verifyUrl}">${verifyUrl}</a>
          </p>
        </div>
      `,
    });
  },

  /**
   * Enviar e-mail genérico com template
   */
  async sendWithTemplate(
    to: string,
    subject: string,
    content: string,
    buttonText?: string,
    buttonUrl?: string
  ): Promise<EmailResult> {
    const buttonHtml =
      buttonText && buttonUrl
        ? `<a href="${buttonUrl}" style="
          display: inline-block;
          background-color: #007bff;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
        ">${buttonText}</a>`
        : "";

    return this.send({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${content}
          ${buttonHtml}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Este é um e-mail automático do MLMP.
          </p>
        </div>
      `,
    });
  },
};

export default emailService;
