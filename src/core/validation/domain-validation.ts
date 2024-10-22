import DomainException from '../exception/domain-exception'
import Error from './error'

export class DomainValidation {
  public static notNullOrEmpty(value: string, fieldName: string): void {
    if (isEmpty(value)) {
      throw DomainException.withAnError(
        new Error(`'${fieldName}' should not be null or empty.`),
      )
    }
  }

  public static futureDate(value: Date): void {
    if (value <= new Date()) {
      throw DomainException.withAnError(
        new Error(`Expiration date must be in the future.`),
      )
    }
  }

  public static minLength(
    value: string,
    length: number,
    fieldName: string,
  ): void {
    if (value.length < length) {
      throw DomainException.withAnError(
        new Error(
          `'${fieldName}' should be at least ${length} characters long.`,
        ),
      )
    }
  }

  public static maxLength(
    value: string,
    length: number,
    fieldName: string,
  ): void {
    if (value.length > length) {
      throw DomainException.withAnError(
        new Error(
          `'${fieldName}' should be at most ${length} characters long.`,
        ),
      )
    }
  }
}

export const isEmpty = (value: string): boolean => {
  return value === null || value === undefined || value === ''
}
