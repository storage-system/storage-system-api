import { a } from 'vitest/dist/suite-IbNSsUWN'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const createStyleBodySchema = z.object({
  name: z.string(),
  isActive: z.boolean().optional().default(false),
  backgroundColor: z.string(),
  textColor: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  tertiaryColor: z.string(),
})

const heroSchema = z
  .array(
    z.object({
      text: z.string(),
      fileId: z.string().uuid(),
    }),
  )
  .default([])

const benefitsSchema = z
  .array(
    z.object({
      text: z.string(),
      description: z.string().optional(),
      fileId: z.string().uuid(),
    }),
  )
  .default([])

const publishEcommerceSchema = z.object({
  name: z.string().min(1).max(255),
  ecommercePreview: z.string().uuid(),
  style: createStyleBodySchema.optional(),
  hero: heroSchema,
  benefits: benefitsSchema,
})

export class PublishEcommerceDTO extends createZodDto(publishEcommerceSchema) {}
