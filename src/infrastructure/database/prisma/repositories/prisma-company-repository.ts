import { CompaniesRepository } from "@/domain/enterprise/company/companies-repository";
import { Company } from "@/domain/enterprise/company/company";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaCompanyMapper } from "../mappers/prisma-company-mapper";

@Injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: {
        email,
      },
      include: {
        users: {
          select: {
            id: true
          }
        }
      },
    })

    if (!company) {
      return null
    }

    return PrismaCompanyMapper.toDomain(company)
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
      },
      include: {
        users: {
          select: {
            id: true,
          }
        },
      }
    })

    if (!company) {
      return null
    }

    return PrismaCompanyMapper.toDomain(company)
  }

  async create(company: Company): Promise<void> {
    const data = PrismaCompanyMapper.toPersistence(company)

    await this.prisma.company.create({
      data,
    })
  }

  async update(company: Company): Promise<void> {
    const data = PrismaCompanyMapper.toPersistence(company)

    await this.prisma.company.update({
      where: {
        id: data.id,
      },
      data
    })
  }

  async delete(companyId: string): Promise<void> {
    await this.prisma.company.update({
      where: {
        id: companyId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date()
      }
    })
  }

  async removeUsers(companyId: string, userIds: string[]): Promise<void> {
    await this.prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        users: {
          deleteMany: userIds.map(id => ({ id }))
        }
      }
    })
  }
}