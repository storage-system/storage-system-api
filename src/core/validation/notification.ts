import { Validation, ValidationHandler } from './validation-handler'
import DomainException from '../exception/domain-exception'
import Error from './error'

export class Notification extends ValidationHandler {
  private errors: Error[]

  private constructor(anErrors: Error[]) {
    super()
    this.errors = anErrors
  }

  public getErrors(): Error[] {
    return this.errors
  }

  public static create(): Notification {
    return new Notification([])
  }

  public static createWithError(anError: Error): Notification {
    return new Notification([]).appendAnError(anError)
  }

  public appendAnError(anError: Error): this {
    this.errors.push(anError)
    return this
  }

  public appendAHandler(aHandler: ValidationHandler): this {
    this.errors = this.errors.concat(aHandler.getErrors())
    return this
  }

  public validate<T>(aValidation: Validation<T>): T | null {
    try {
      return aValidation.validate()
    } catch (ex) {
      if (ex instanceof DomainException) {
        this.errors = this.errors.concat(ex.getErrors())
      }
    }

    return null
  }
}
