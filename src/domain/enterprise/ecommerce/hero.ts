import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

import { FileID } from '../file/file'

export interface HeroProps {
  fileId: FileID
  text: string
}

export class HeroID extends UniqueEntityID {}

export class Hero extends Entity<HeroProps> {
  static create(props: HeroProps, id?: HeroID) {
    return new Hero(
      {
        fileId: props.fileId,
        text: props.text,
      },
      id,
    )
  }

  get text() {
    return this.props.text
  }

  get fileId() {
    return this.props.fileId
  }
}
