import RuntimeException from './runtime-exception'

export default class WrongCredentialsException extends RuntimeException {
  public constructor(aMessage: string) {
    super(aMessage)
  }
}
