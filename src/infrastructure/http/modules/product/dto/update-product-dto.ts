import { createZodDto } from 'nestjs-zod'

import { createProductBodySchema } from './create-product-dto'

export const updateProductBodySchema = createProductBodySchema.partial()

export class UpdateProductDTO extends createZodDto(updateProductBodySchema) {}
