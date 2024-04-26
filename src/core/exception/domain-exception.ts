import RuntimeException from './runtime-exception'
import Error from '../validation/error'

export default class DomainException extends RuntimeException {
  protected readonly errors: Error[] = []

  protected constructor(
    readonly aMessage: string,
    readonly anErrors: Error[],
  ) {
    super(aMessage)
    this.errors = anErrors
  }

  getErrors(): Error[] {
    return this.errors
  }

  static withAnError(anError: Error): DomainException {
    return new DomainException(anError.message, [anError])
  }

  static withListError(anError: Error[]): DomainException {
    return new DomainException('', anError)
  }
}
