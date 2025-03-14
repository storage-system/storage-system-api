import { CreateProductDTO } from '@/infrastructure/http/modules/product/dto/create-product-dto'
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service'
import { StatusProduct } from '@/domain/enterprise/product/product'
import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import * as XLSX from 'xlsx'

@Injectable()
export class SpreadsheetService {
  constructor(private prisma: PrismaService) {}

  async generateExcelProductTemplate(res: Response) {
    const headers = [
      [
        'Nome',
        'Descrição',
        'Preço Original',
        'Preço Final',
        'Quantidade',
        'Data de Fabricação',
        'Data de Validade',
        'Unidade',
        'Peso',
      ],
    ]

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(headers)

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Modelo')

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=modelo_produtos.xlsx',
    )

    return res.send(buffer)
  }
}
