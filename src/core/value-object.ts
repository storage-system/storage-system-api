import { isEqual } from 'lodash'

import { deepFreeze } from './object'

interface ValueObjectProps {
  [index: string]: unknown
}

/**
 * @description Value object there isn't identity and are objects that we determine
 * their equality through their structural property.
 */
export abstract class ValueObject<Value = ValueObjectProps> {
  protected readonly _value: Value

  constructor(aValue: Value) {
    this._value = deepFreeze(aValue)
  }

  get value(): Value {
    return this._value
  }

  public equals(object: this): boolean {
    if (object === null || object === undefined) {
      return false
    }

    if (object.value === undefined) {
      return false
    }

    if (object.constructor.name !== this.constructor.name) {
      return false
    }

    return isEqual(this.value, object.value)
  }

  toString: () => string = (): string => {
    if (typeof this.value !== 'object' || this.value === null) {
      return String(this.value)
    }
    const valueToString: string = this.value.toString()
    return valueToString === '[object Object]'
      ? JSON.stringify(this.value)
      : valueToString
  }
}
