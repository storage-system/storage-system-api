import { Slug } from '@/domain/enterprise/slug/slug'
import { Ecommerce, Style } from '@prisma/client'
import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaEcommerceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async publishEcommerce(
    data: Pick<Ecommerce, 'name' | 'slug' | 'companyId'> & {
      style: Pick<
        Style,
        | 'name'
        | 'backgroundColor'
        | 'primaryColor'
        | 'secondaryColor'
        | 'tertiaryColor'
        | 'textColor'
      >
    },
  ) {
    return await this.prisma.ecommerce.create({
      data: {
        name: data.name,
        slug: data.slug,
        company: { connect: { id: data.companyId } },
        styles: {
          create: {
            name: data.style.name,
            backgroundColor: data.style.backgroundColor,
            primaryColor: data.style.primaryColor,
            secondaryColor: data.style.secondaryColor,
            tertiaryColor: data.style.tertiaryColor,
            textColor: data.style.textColor,
            companyId: data.companyId,
          },
        },
      },
    })
  }

  async findEcommerceBySlug(slug: string): Promise<
    | (Pick<Ecommerce, 'id' | 'name' | 'slug' | 'createdAt' | 'isActive'> & {
        styles: Style[]
      })
    | null
  > {
    const data = await this.prisma.ecommerce.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        isActive: true,
        styles: true,
      },
    })

    if (!data) {
      return null
    }

    return data
  }

  async findEcommerceById(id: string) {
    const data = await this.prisma.ecommerce.findUnique({
      where: { id },
      include: {
        styles: true,
      },
    })

    if (!data) {
      return null
    }

    return data
  }
}
