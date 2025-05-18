import { ListStylesCommand } from '@/domain/application/style/use-cases/retrieve/list/list-styles-command'
import { Pagination } from '@/core/entities/pagination'
import { Repository } from '@/core/repository'

import { Style } from './style'

export abstract class StyleRepository extends Repository<Style> {
  abstract findAll(params: ListStylesCommand): Promise<Pagination<Style>>
  abstract findActiveStyleByCompanyId(
    ecommerceId: string,
  ): Promise<Style | null>
}
