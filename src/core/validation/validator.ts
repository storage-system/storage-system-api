import { ValidationHandler } from './validation-handler'

export default abstract class Validator {
  abstract validate(): void

  private readonly handler: ValidationHandler

  protected constructor(aHandler: ValidationHandler) {
    this.handler = aHandler
  }

  protected validationHandler(): ValidationHandler {
    return this.handler
  }
}
