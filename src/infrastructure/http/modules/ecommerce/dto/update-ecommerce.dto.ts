import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const updateEcommerceSchema = z.object({
  name: z.string().min(1).optional(),
  ecommercePreview: z.string().uuid(),

  hero: z
    .array(
      z.object({
        fileId: z.string().uuid(),
        text: z.string().min(1),
      }),
    )
    .optional(),

  style: z
    .object({
      name: z.string().min(1),
      isActive: z.boolean(),
      backgroundColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
      textColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
      primaryColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
      secondaryColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
      tertiaryColor: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/),
    })
    .optional(),
})

export class UpdateEcommerceDTO extends createZodDto(updateEcommerceSchema) {}
