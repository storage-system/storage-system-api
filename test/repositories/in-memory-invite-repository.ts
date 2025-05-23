import { InviteRepository } from '@/domain/enterprise/invite/invite-repository'
import { Invite } from '@/domain/enterprise/invite/invite'

export class InMemoryInviteRepository implements InviteRepository {
  public items: Invite[] = []

  async getPendings(companyId: string): Promise<Invite[]> {
    const pendingInvites = this.items.filter(
      (item) => item.companyId.toString() === companyId && !item.isExpired(),
    )

    return pendingInvites
  }

  async refuse(anId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(record: Invite): Promise<void> {
    this.items.push(record)
  }

  async update(record: Invite): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === record.id)
    this.items[itemIndex] = record
  }

  async delete(anId: string): Promise<void> {
    const filteredInvites = this.items.filter(
      (invite) => invite.id.toString() !== anId,
    )
    this.items = filteredInvites
  }

  async findById(anId: string): Promise<Invite | null> {
    const item = this.items.find((item) => item.id.toString() === anId)

    if (!item) {
      return null
    }

    return item
  }
}
