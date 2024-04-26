import { Notification } from '../validation/notification'
import DomainException from './domain-exception'

export default class NotificationException extends DomainException {
  public constructor(
    readonly aMessage: string,
    readonly aNotification: Notification,
  ) {
    super(aMessage, aNotification.getErrors())
  }
}
