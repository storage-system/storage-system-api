import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  MethodNotAllowedException,
  Param,
  Patch,
} from '@nestjs/common'
import { CompanyPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditCategoryUseCase } from '@/domain/application/category/use-cases/edit-category'
import { CurrentCompany } from '@/infra/auth/current-company-decorator'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

const editCategoryBodySchema = z.object({
  name: z.string(),
  isActive: z.boolean()
})

const bodyValidationPipe = new ZodValidationPipe(editCategoryBodySchema)

type EditCategoryBodySchema = z.infer<typeof editCategoryBodySchema>

@Controller('/categories/:id')
export class EditCategoryController {
  constructor(private editCategory: EditCategoryUseCase) { }

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditCategoryBodySchema,
    @CurrentCompany() company: CompanyPayload,
    @Param('id') categoryId: string,
  ) {
    const { name, isActive } = body
    const companyId = company.sub

    const result = await this.editCategory.execute({
      name,
      isActive,
      categoryId,
      companyId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
