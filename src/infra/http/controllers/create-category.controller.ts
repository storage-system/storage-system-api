import { CurrentCompany } from '@/infra/auth/current-company-decorator'
import { CompanyPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, NotFoundException, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { CreateCategoryUseCase } from '@/domain/application/category/use-cases/create-category'
import { z } from 'zod'

const createCategoryBodySchema = z.object({
  name: z.string(),
  isActive: z.boolean(),
})

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@Controller('/categories')
@UseGuards(JwtAuthGuard)
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) { }

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCategoryBodySchema,
    @CurrentCompany() company: CompanyPayload
  ) {
    const { name, isActive } = createCategoryBodySchema.parse(body)

    const companyId = company.sub

    if (!companyId) {
      throw new NotFoundException('Company not found');
    }

    const result = await this.createCategory.execute({
      name,
      isActive,
      companyId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}