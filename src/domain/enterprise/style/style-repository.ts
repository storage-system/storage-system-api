import { Repository } from '@/core/repository'
import { Pagination } from '@/core/entities/pagination'
import { Style } from './style'
import { ListStylesCommand } from '@/domain/application/style/use-cases/retrieve/list/list-styles-command'

export abstract class StyleRepository extends Repository<Style> {
  abstract findAll(params: ListStylesCommand): Promise<Pagination<Style>>
}
