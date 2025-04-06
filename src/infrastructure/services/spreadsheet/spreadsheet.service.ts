import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import * as XLSX from 'xlsx'

@Injectable()
export class SpreadsheetService {
  async generateExcelProductTemplate(res: Response) {
    const headers = [
      [
        'Nome',
        'Descrição',
        'Preço Original',
        'Preço Final',
        'Porcentagem de desconto',
        'Quantidade em estoque',
        'Quantidade mínima de estoque',
        'Data de Fabricação',
        'Data de Validade',
        'Unidade',
        'Peso',
        'Altura',
        'Largura',
        'Profundidade',
        'Fabricante',
        'Lote',
        'Status',
        'Categoria',
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
