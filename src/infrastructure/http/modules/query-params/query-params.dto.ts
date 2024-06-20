import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const queryParamsDTO = z.object({
  page: z.coerce.number().optional().default(1),
  perPage: z.coerce.number().optional().default(10),
})

export class QueryParamsDTO extends createZodDto(queryParamsDTO) { }