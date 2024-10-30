export abstract class EventService {
  abstract send(message: Object): Promise<void>
}
