import { queryParamsDTO } from "../../query-params/query-params.dto";
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const schema = z.object({
  companyId: z.string().uuid().optional(),
})

const listUsersParamsDTO = queryParamsDTO.merge(schema);

export class ListUsersParamsDTO extends createZodDto(listUsersParamsDTO) {}
