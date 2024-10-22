import { DomainValidation } from '@/core/validation/domain-validation'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/value-object'
import { UniquePin } from '@/core/unique-pin'
import { Replace } from '@/core/replace'

export interface AccessCodeProps {
  code: string
  expiresAt: Date
  createdAt: Date
}

export type AccessCodeConstructorProps = Replace<
  AccessCodeProps,
  {
    createdAt?: Date
    code?: string
    expiresAt?: Date
  }
>

export class AccessCodeID extends UniqueEntityID {}
export class AccessCode extends ValueObject<AccessCodeProps> {
  static FIFTY_EIGHT_HOURS: number = 48 * 60 * 60

  static create(props: AccessCodeConstructorProps = {}): AccessCode {
    const defaultProps = {
      code: new UniquePin().toString(),
      createdAt: new Date(),
      expiresAt: new Date(new Date().getTime() + this.FIFTY_EIGHT_HOURS * 1000),
    }

    return new AccessCode({ ...defaultProps, ...props })
  }

  public validate() {
    DomainValidation.notNullOrEmpty(this.code, 'Código')
    DomainValidation.minLength(this.code, 8, 'Código')
    DomainValidation.maxLength(this.code, 8, 'Código')
  }

  get isExpired(): boolean {
    return this.value.expiresAt < new Date()
  }

  get code(): string {
    return this.value.code
  }

  get expiresAt(): Date {
    return this.value.expiresAt
  }

  get createdAt() {
    return this.value.createdAt
  }
}
