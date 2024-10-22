import { Notification } from '@/core/validation/notification'

import { AccessCode } from './access-code'

describe('Access Code Unit Tests', () => {
  let notification: Notification

  beforeEach(() => {
    notification = Notification.create()
  })

  it('should create a new code', () => {
    const data = {
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7),
    }

    const item = AccessCode.create(data)

    item.validate()
    expect(notification.hasErrors()).toBeFalsy()

    expect(item).toBeDefined()
    expect(item.code).toHaveLength(8)
    expect(item.expiresAt).toBeDefined()
    expect(item.isExpired).toBeFalsy()
    expect(item.createdAt).toBeInstanceOf(Date)
  })
})
