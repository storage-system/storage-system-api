import { Repository } from '@/core/repository'
import { Pagination } from '@/core/entities/pagination'
import { Style } from './style'
import { SearchQuery } from '@/core/entities/search-query'

export abstract class StyleRepository extends Repository<Style> {
  abstract findAll(params: SearchQuery): Promise<Pagination<Style>>
}
