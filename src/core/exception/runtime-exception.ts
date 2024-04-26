export default class RuntimeException extends Error {
  constructor(readonly aMessage: string) {
    super(aMessage)
  }
}
