import { EventService } from './event-service'

export interface EmailMessage {
  to: string
  cc?: string[]
  subject: string
  template: string
  properties: Record<string, string | number | boolean>
}

export abstract class EmailService extends EventService {
  abstract send(message: EmailMessage): Promise<void>
}
