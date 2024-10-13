import { User, UserProps } from '@/domain/enterprise/user/user'

export class GetUserOutput {
  id: string
  companyId?: string
  name: string
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null

  constructor(aUserProps: UserProps & { id: string }) {
    this.id = aUserProps.id.toString()
    this.name = aUserProps.name
    this.companyId = aUserProps.companyId?.toString() ?? undefined

    this.createdAt = aUserProps.createdAt
    this.updatedAt = aUserProps.updatedAt
    this.deletedAt = aUserProps.deletedAt ?? undefined
  }

  static fromAggregate(user: User) {
    return new GetUserOutput(user.toJSON())
  }
}
