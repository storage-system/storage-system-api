import { UseCaseError } from '@/core/errors/use-case-error'

export class AlreadyExistsError extends Error implements UseCaseError {
  constructor(anAggregate: string, identifier: string) {
    super(`${anAggregate} "${identifier}" already exists.`)
  }
}