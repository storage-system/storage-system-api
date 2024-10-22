import { describe, it, expect, vi, beforeEach } from 'vitest'

import { UserRoles } from '../user/user-types'
import { CompanyID } from '../company/company'
import { AccessCode } from './access-code'
import { UserID } from '../user/user'
import { Invite } from './invite'

const mockAuthorId = new UserID()
const mockCompanyId = new CompanyID()

describe('Invite Entity', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should create an invite with the required properties.', () => {
    const now = new Date()
    vi.setSystemTime(now)

    const invite = Invite.create({
      email: 'test@example.com',
      roles: [UserRoles.MEMBER],
      authorId: mockAuthorId,
      companyId: mockCompanyId,
    })

    const expiresAt = invite.accessCode.expiresAt
    const diffInMilliseconds = expiresAt.getTime() - now.getTime()
    const FORTY_EIGHT_HOURS_IN_MS = 48 * 60 * 60 * 1000

    expect(invite.accessCode).toBeInstanceOf(AccessCode)
    expect(invite.accessCode.code).toBeDefined()
    expect(Math.abs(diffInMilliseconds - FORTY_EIGHT_HOURS_IN_MS)).toBeLessThan(
      1000,
    )

    expect(invite).toBeInstanceOf(Invite)
    expect(invite.email).toBe('test@example.com')
    expect(invite.roles).toEqual([UserRoles.MEMBER])
    expect(invite.authorId).toBe(mockAuthorId.toString())
    expect(invite.companyId).toBe(mockCompanyId)
    expect(invite.createdAt).toBeInstanceOf(Date)
    expect(invite.expiresIn).toBeInstanceOf(Date)
  })

  it('should set the expiration date to 48 hours from creation.', () => {
    const now = new Date()
    vi.setSystemTime(now)

    const invite = Invite.create({
      email: 'test@example.com',
      roles: [UserRoles.MEMBER],
      authorId: mockAuthorId,
      companyId: mockCompanyId,
    })

    const expectedExpiration = new Date(now.getTime() + 48 * 60 * 60 * 1000)
    expect(invite.expiresIn.getTime()).toBe(expectedExpiration.getTime())
  })

  it('should allow you to create an invite with a personalized expiration date.', () => {
    const customExpiration = new Date('2025-01-01T00:00:00Z')

    const invite = Invite.create({
      email: 'test@example.com',
      roles: [UserRoles.MEMBER],
      authorId: mockAuthorId,
      companyId: mockCompanyId,
      expiresIn: customExpiration,
    })

    expect(invite.expiresIn).toEqual(customExpiration)
  })
})
