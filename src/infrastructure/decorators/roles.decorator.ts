import { UserRoles } from '@/domain/enterprise/user/user-types'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles)
