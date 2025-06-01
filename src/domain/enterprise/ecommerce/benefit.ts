import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WatchedList } from '@/core/watched-list'
import { Entity } from '@/core/entities/entity'

import { FileID } from '../file/file'

export interface BenefitProps {
  fileId: FileID
  text: string
  description?: string
}

export class BenefitID extends UniqueEntityID {}

export class Benefit extends Entity<BenefitProps> {
  static create(props: BenefitProps, id?: BenefitID) {
    return new Benefit(
      {
        fileId: props.fileId,
        text: props.text,
        description: props.description,
      },
      id,
    )
  }

  get text() {
    return this.props.text
  }

  get description() {
    return this.props.description
  }

  get fileId() {
    return this.props.fileId
  }
}

export class BenefitWatchedList extends WatchedList<Benefit> {
  compareItems(a: Benefit, b: Benefit): boolean {
    return a.fileId.equals(b.fileId)
  }

  constructor(items: Benefit[] = []) {
    super(items)
  }

  static fromArray(items: Benefit[]) {
    return new BenefitWatchedList(items)
  }
}
