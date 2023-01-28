import { Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import { LoggerPlugin } from '../index.js'

interface EmailConfig {
  from: string
  to: string
}

export class EmailPlugin implements LoggerPlugin {
  #transport: Transporter<SMTPTransport>
  #emails: EmailConfig

  constructor(transport: Transporter<SMTPTransport>, emails: EmailConfig) {
    this.#transport = transport
    this.#emails = emails
  }

  async push(header: string, logs: string[]) {
    if (logs.length === 0) return

    try {
      await this.#transport.sendMail({
        from: this.#emails.from,
        to: this.#emails.to,
        subject: header,
        text: logs.join('\n'),
      })
    } catch (e) {
      console.error(e)
    }
  }
}
