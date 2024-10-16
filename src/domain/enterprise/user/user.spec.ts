import { describe, it, expect, beforeEach } from 'vitest'

import { User, UserProps } from './user'
import { UserRoles } from './user-types'

describe('User Entity', () => {
  let userProps: Omit<UserProps, 'createdAt' | 'updatedAt' | 'deletedAt'>

  beforeEach(() => {
    userProps = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secure-password',
      phone: '1234567890',
      roles: [UserRoles.MEMBER],
    }
  })

  it('should create a user with the correct properties', () => {
    const user = User.create(userProps)

    expect(user.name).toBe(userProps.name)
    expect(user.email).toBe(userProps.email)
    expect(user.password).toBe(userProps.password)
    expect(user.phone).toBe(userProps.phone)
    expect(user.roles).toBe(userProps.roles)
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
    expect(user.deletedAt).toBeUndefined()
  })

  it('should correctly update properties using the update method', () => {
    const user = User.create(userProps)
    const oldUpdatedAt = user.updatedAt

    const updatedProps: Partial<UserProps> = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0987654321',
      roles: [UserRoles.ADMIN],
    }

    user.update(updatedProps)

    expect(user.name).toBe(updatedProps.name)
    expect(user.email).toBe(updatedProps.email)
    expect(user.phone).toBe(updatedProps.phone)
    expect(user.roles).toBe(updatedProps.roles)
    expect(user.updatedAt).not.toBe(oldUpdatedAt)
  })

  it('should not update the password if not provided in update method', () => {
    const user = User.create(userProps)
    const oldPassword = user.password

    user.update({ name: 'Jane Doe' })

    expect(user.name).toBe('Jane Doe')
    expect(user.password).toBe(oldPassword)
  })
})
