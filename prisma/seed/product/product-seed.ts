import { PrismaClient, StatusProduct } from '@prisma/client'
import { randomUUID } from 'crypto'
import * as fs from 'fs/promises'
import { Client } from 'minio'
import * as path from 'path'
import 'dotenv/config'

import * as products from './product.json'

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT!),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
})

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME!

async function emptyBucket(bucket: string) {
  const stream = minioClient.listObjects(bucket, '', true)
  for await (const obj of stream) {
    if (obj.name) {
      await minioClient.removeObject(bucket, obj.name)
    }
  }
}

export async function productsSeed(prisma: PrismaClient) {
  // Reset do bucket
  const exists = await minioClient.bucketExists(BUCKET_NAME)
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, '')
  } else {
    await emptyBucket(BUCKET_NAME)
  }

  // Limpa a tabela de arquivos
  await prisma.file.deleteMany()

  for (const product of products) {
    const firstCategory = product.categories?.[0]
    const filename = product.slug.concat('.png')
    if (!filename) {
      // eslint-disable-next-line no-console
      console.warn(
        `⚠️ Sem imagem para categoria: ${firstCategory} no produto ${product.name}`,
      )
      continue
    }

    let imagePath
    let buffer
    let objectName

    try {
      imagePath = path.resolve(__dirname, '../images', filename)
      buffer = await fs.readFile(imagePath)
      objectName = `${filename}`

      await minioClient.putObject(BUCKET_NAME, objectName, buffer)
    } catch (error) {
      continue
    }

    const fileId = randomUUID()

    await prisma.product.upsert({
      where: { id: product.id },
      create: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        originalPrice: product.original_price,
        finalPrice: product.final_price,
        discountPercentage: product.discount_percentage,
        quantityInStock: product.quantity_in_stock,
        manufactureDate: new Date(product.manufacture_date),
        dueDate: new Date(product.due_date),
        validityInDays: product.validity_in_days,
        minimumStock: product.minimum_stock,
        unitOfMeasure: product.unit_of_measure,
        weight: product.weight,
        dimensionsHeight: product.dimensions_height,
        dimensionsWidth: product.dimensions_width,
        dimensionsDepth: product.dimensions_depth,
        manufacturer: product.manufacturer ?? undefined,
        batch: product.batch ?? undefined,
        status: product.status as StatusProduct,
        company: {
          connect: { id: product.company_id },
        },
        categories: {
          connect: product.categories.map((id: string) => ({ id })),
        },
        createdAt: new Date(product.created_at),
      },
      update: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        originalPrice: product.original_price,
        finalPrice: product.final_price,
        discountPercentage: product.discount_percentage,
        quantityInStock: product.quantity_in_stock,
        manufactureDate: new Date(product.manufacture_date),
        dueDate: new Date(product.due_date),
        validityInDays: product.validity_in_days,
        minimumStock: product.minimum_stock,
        unitOfMeasure: product.unit_of_measure,
        weight: product.weight,
        dimensionsHeight: product.dimensions_height,
        dimensionsWidth: product.dimensions_width,
        dimensionsDepth: product.dimensions_depth,
        manufacturer: product.manufacturer ?? undefined,
        batch: product.batch ?? undefined,
        status: product.status as StatusProduct,
        company: {
          connect: { id: product.company_id },
        },
        categories: {
          set: product.categories.map((id: string) => ({ id })),
        },
        updatedAt: new Date(),
      },
    })

    await prisma.file.create({
      data: {
        id: fileId,
        path: objectName, // 👈 apenas o caminho interno
        size: buffer.byteLength,
        filename,
        product: { connect: { id: product.id } },
        createdAt: new Date(),
      },
    })
  }
}
