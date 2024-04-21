import { UseCaseError } from '@/core/errors/use-case-error'

export class CategoryAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Category "${identifier}" already exists.`)
  }
}