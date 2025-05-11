import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

import { createStyleBodySchema } from '../../style/dto/create-style.dto'

const publishEcommerceDTO = z.object({
  name: z.string().min(1),
  style: createStyleBodySchema.optional(),
})

export class PublishEcommerceDTO extends createZodDto(publishEcommerceDTO) {}
