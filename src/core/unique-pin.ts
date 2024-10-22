import { randomBytes } from 'node:crypto'

export class UniquePin {
  private value: string

  private generateValue(size: number) {
    return randomBytes(size / 2)
      .toString('hex')
      .toUpperCase()
  }

  constructor(value?: string, size: number = 8) {
    this.value = value ?? this.generateValue(size)
  }

  equals(id: this) {
    return id.toString() === this.value
  }

  toString() {
    return this.value
  }
}
