import { EventService } from './event-service'

export interface EmailMessage {
  to: string
  cc?: string[]
  subject: string
  template: string
  properties: Record<string, unknown>
  attachments?: { filename: string; content: Buffer[] }[]
}

export abstract class EmailService extends EventService {}
