import {
  ExecutionContext,
  createParamDecorator,
  PipeTransform,
  ArgumentMetadata,
  UnauthorizedException,
} from '@nestjs/common'
import { UserRoles } from '@/domain/enterprise/user/user-types'
import { z } from 'zod'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  companyId: z.string().uuid().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  roles: z.array(z.nativeEnum(UserRoles)).optional(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext, pipe?: PipeTransform) => {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization.replace('Bearer ', '')
    const userData = atob(token.split('.')[1])
    const safeParse = tokenPayloadSchema.safeParse(JSON.parse(userData))

    if (!safeParse.success || !token) {
      throw new UnauthorizedException('Token is invalid or not provided')
    }

    const { data: parsedData } = safeParse

    if (pipe) {
      const metadata: ArgumentMetadata = {
        type: 'custom',
        data: data as string,
        metatype: Object,
      }
      return await pipe.transform(parsedData, metadata)
    }

    return parsedData
  },
)
