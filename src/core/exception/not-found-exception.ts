import { UniqueEntityID } from '../entities/unique-entity-id';
import DomainException from './domain-exception'

export default class ResourceNotFoundException extends DomainException {
  private constructor(aMessage: string, anErrors: Array<Error>) {
    super(aMessage, anErrors)
  }

  public static with(anAggregate: string, anId: UniqueEntityID): ResourceNotFoundException {
    const anError = `${anAggregate} com ID ${anId.toString()} não foi encontrado`;
    return new ResourceNotFoundException(anError, new Array<Error>());
  }
}
