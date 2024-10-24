import { ValidationHandler } from '@/core/validation/validation-handler'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { CompanyID } from '../company/company'
import { UserRoles } from '../user/user-types'
import { AccessCode } from './access-code'
import { UserID } from '../user/user'

export class InviteID extends UniqueEntityID {}

export interface InviteProps {
  email: string
  roles: UserRoles[]
  authorId: UserID
  companyId: CompanyID
  accessCode: AccessCode
  expiresIn: Date

  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class Invite extends Entity<InviteProps> {
  static create(
    props: Optional<InviteProps, 'createdAt' | 'accessCode' | 'expiresIn'>,
    id?: InviteID,
  ) {
    const FIFTY_EIGHT_HOURS = 48 * 60 * 60

    const invite = new Invite(
      {
        expiresIn: new Date(new Date().getTime() + FIFTY_EIGHT_HOURS * 1000),
        accessCode: AccessCode.create(),
        createdAt: new Date(),
        ...props,
      },
      id,
    )

    return invite
  }

  public isExpired(): boolean {
    const now = new Date()
    return this.expiresIn < now && this.accessCode.expiresAt < now
  }

  public revoke() {
    this.props.deletedAt = new Date()
  }

  validate(aHandler: ValidationHandler) {
    const now = new Date()

    if (this.expiresIn < now) {
      aHandler.appendAnError(new Error('O convite está expirado.'))
    }

    if (this.accessCode.expiresAt < now) {
      aHandler.appendAnError(new Error('Código de acesso expirado.'))
    }
  }

  get email() {
    return this.props.email
  }

  get roles() {
    return this.props.roles
  }

  get authorId() {
    return this.props.authorId.toString()
  }

  get companyId() {
    return this.props.companyId
  }

  get expiresIn() {
    return this.props.expiresIn
  }

  get accessCode() {
    return this.props.accessCode
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
