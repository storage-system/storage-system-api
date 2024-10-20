import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

import { UserRoles } from './user-types'

export interface UserProps {
  name: string
  email: string
  password: string
  phone: string
  roles: UserRoles[]
  companyId?: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
}

export class UserID extends UniqueEntityID {}

export class User extends Entity<UserProps> {
  static create(
    props: Optional<UserProps, 'createdAt' | 'roles'>,
    id?: UserID,
  ) {
    const user = new User(
      {
        roles: [UserRoles.MEMBER],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...props,
      },
      id,
    )

    return user
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get phone() {
    return this.props.phone
  }

  get roles() {
    return this.props.roles
  }

  public get companyId(): UniqueEntityID | undefined {
    return this.props.companyId
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

  update(anUser: Partial<UserProps>) {
    this.props.name = anUser.name ?? this.name
    this.props.email = anUser.email ?? this.email
    this.props.password = anUser.password ?? this.password
    this.props.phone = anUser.phone ?? this.phone
    this.props.roles = anUser.roles ?? this.roles
    this.props.companyId = anUser.companyId ?? this.companyId

    this.touch()
  }

  static isAdmin(roles: UserRoles[]): boolean {
    return roles.includes(UserRoles.ADMIN)
  }

  static isResponsible(roles: UserRoles[]): boolean {
    return roles.includes(UserRoles.RESPONSIBLE)
  }

  static canDeleteCompany(roles: UserRoles[]): boolean {
    return this.isResponsible(roles) || this.isAdmin(roles)
  }
}
