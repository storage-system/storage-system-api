import {
  EmailService,
  EmailMessage,
} from '@/domain/application/services/email-service'

export class InMemoryEmailService implements EmailService {
  private sentEmails: EmailMessage[] = []

  async send(message: EmailMessage): Promise<void> {
    this.sentEmails.push(message)
  }

  getSentEmails(): EmailMessage[] {
    return this.sentEmails
  }

  clearSentEmails(): void {
    this.sentEmails = []
  }
}
