import { ZodValidationPipe } from "@/infrastructure/http/pipes/zod-validation-pipe";
import { z } from "zod";

const editCompanyBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  contact: z.string().optional(),
  responsible: z.string().optional()
})

export const editCompanyBodyValidationPipe = new ZodValidationPipe(editCompanyBodySchema)
export type EditCompanyBodySchema = z.infer<typeof editCompanyBodySchema>