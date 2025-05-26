import { ReportFrequency } from '@/domain/enterprise/configuration/configuration'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const createConfigurationBodySchema = z.object({
  userId: z.string().uuid(),
  companyId: z.string(),
  daysBeforeOldStock: z.number().min(1).max(999),
  warningDays: z.number().min(1).max(999),
  emailNotification: z.boolean(),
  systemNotification: z.boolean(),
  autoDiscardAfterExpiration: z.boolean(),
  freeShippingOnOldStock: z.boolean(),
  reportFrequency: z.nativeEnum(ReportFrequency),
})

export class CreateConfigurationDTO extends createZodDto(
  createConfigurationBodySchema,
) {}
