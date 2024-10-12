import { ReportFrequency } from '@/domain/enterprise/configuration/configuration'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const updateConfigurationBodySchema = z.object({
  daysBeforeOldStock: z.number().min(1).max(999).optional(),
  warningDays: z.number().min(1).max(999).optional(),
  emailNotification: z.boolean().optional(),
  systemNotification: z.boolean().optional(),
  autoDiscardAfterExpiration: z.boolean().optional(),
  freeShippingOnOldStock: z.boolean().optional(),
  reportFrequency: z.nativeEnum(ReportFrequency).optional(),
})

export class UpdateConfigurationDTO extends createZodDto(
  updateConfigurationBodySchema,
) {}
