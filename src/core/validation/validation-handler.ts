import Error from "./error"

export interface Validation<T> {
  validate(): T
}

export abstract class ValidationHandler {
  abstract getErrors(): Error[]

  abstract validate<T>(aValidation: Validation<T>): T | null

  abstract appendAnError(anError: Error): ValidationHandler

  abstract appendAHandler(aHandler: ValidationHandler): ValidationHandler

  hasErrors(): boolean {
    return this.getErrors() != null && this.getErrors().length > 0
  }

  firstError(): Error | null {
    if (this.getErrors() != null && this.getErrors().length > 0) {
      return this.getErrors()[0]
    } else {
      return null
    }
  }
}
