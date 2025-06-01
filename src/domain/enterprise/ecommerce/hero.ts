import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WatchedList } from '@/core/watched-list'
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

export class HeroWatchedList extends WatchedList<Hero> {
  compareItems(a: Hero, b: Hero): boolean {
    return a.fileId.equals(b.fileId)
  }

  constructor(items: Hero[] = []) {
    super(items)
  }

  static fromArray(items: Hero[]) {
    return new HeroWatchedList(items)
  }
}
