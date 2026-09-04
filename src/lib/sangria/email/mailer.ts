import nodemailer from 'nodemailer';
import { getEnv } from '../core/env';

export interface SendEmailOptions {
	to: string | string[];
	subject: string;
	text?: string;
	html?: string;
	from?: string;
}

class SangriaMailer {
	private transporter: nodemailer.Transporter | null = null;

	private getTransporter(): nodemailer.Transporter {
		if (!this.transporter) {
			const host = getEnv('SMTP_HOST', 'localhost');
			const port = Number(getEnv('SMTP_PORT', '1025')) || 1025;
			const user = getEnv('SMTP_USER', '');
			const pass = getEnv('SMTP_PASS', '');

			this.transporter = nodemailer.createTransport({
				host,
				port,
				secure: port === 465,
				auth: user ? { user, pass } : undefined,
				tls: {
					rejectUnauthorized: false
				}
			});
		}
		return this.transporter;
	}

	async send(options: SendEmailOptions): Promise<{ messageId: string }> {
		const transporter = this.getTransporter();
		const from = options.from || getEnv('SMTP_FROM', 'Sangria <noreply@sangria.local>');

		const info = await transporter.sendMail({
			from,
			to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
			subject: options.subject,
			text: options.text,
			html: options.html
		});

		return { messageId: info.messageId };
	}
}

export const mailer = new SangriaMailer();
