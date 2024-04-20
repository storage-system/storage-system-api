import { CurrentCompany } from '@/infra/auth/current-company-decorator'
import { CompanyPayload } from '@/infra/auth/jwt.strategy'
import { Slug } from '@/domain/enterprise/slug/slug'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Body, Controller, NotFoundException, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
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
  constructor(private prisma: PrismaService) { }

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

    const slug = Slug.convertToSlug(name)

    await this.prisma.category.create({
      data: {
        name,
        slug,
        isActive,
        companyId: companyId,
        createdAt: new Date(),
      },
    })
  }
}