import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserRole } from './user-types'

export interface UserProps {
  name: string
  email: string
  password: string
  phone: string
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date
  role: UserRole
}

export class User extends Entity<UserProps> {
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

  set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  get role() {
    return this.props.role
  }

  set role(role: UserRole) {
    this.props.role = role
    this.touch()
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

  static create(
    props: Optional<UserProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return user
  }

  update(anUser: Partial<UserProps>) {
    this.props.name = anUser.name ?? this.name
    this.props.email = anUser.email ?? this.email
    this.props.password = anUser.password ?? this.password
    this.props.phone = anUser.phone ?? this.phone
    this.props.role = anUser.role ?? this.role

    this.touch()
  }
}
