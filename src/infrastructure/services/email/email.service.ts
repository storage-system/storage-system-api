import {
  EmailMessage,
  EmailService,
} from '@/domain/application/services/email-service'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import * as path from 'node:path'
import * as fs from 'node:fs'

@Injectable()
export class RMQService implements EmailService {
  constructor(private mailerService: MailerService) {}

  async send(message: EmailMessage): Promise<void> {
    const templatePath = path.join(
      __dirname,
      `/templates/${message.template}.html`,
    )

    let template = fs.readFileSync(templatePath).toString()

    for (const [key, value] of Object.entries(message.properties)) {
      template = template.replace(
        new RegExp(`{{\\s*${key}\\s*}}`, 'gi'),
        String(value),
      )
    }

    const props = {
      to: message.to,
      subject: message.subject,
      html: template,
    }

    const emailSend = await this.mailerService.sendMail({
      ...props,
    })

    return emailSend
  }
}
