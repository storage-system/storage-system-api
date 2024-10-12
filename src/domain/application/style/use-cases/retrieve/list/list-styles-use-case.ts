import { StyleRepository } from '@/domain/enterprise/style/style-repository'
import { Pagination, PaginationProps } from '@/core/entities/pagination'
import { Injectable } from '@nestjs/common'

import { ListStylesCommand } from './list-styles-command'
import { GetStyleOutput } from '../get/get-style-output'

type ListStylesUseCaseResponse = PaginationProps<GetStyleOutput>

@Injectable()
export class ListStylesUseCase {
  constructor(private styleRepository: StyleRepository) {}

  async execute(query: ListStylesCommand): Promise<ListStylesUseCaseResponse> {
    const styles = await this.styleRepository.findAll(query)

    return new Pagination({
      total: styles.total,
      items: styles.items.map(GetStyleOutput.fromAggregate),
      perPage: styles.perPage,
      page: styles.page,
    })
  }
}
