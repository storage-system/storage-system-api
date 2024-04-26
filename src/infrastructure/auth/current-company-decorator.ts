import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { CompanyPayload } from './jwt.strategy'

export const CurrentCompany = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as CompanyPayload
  },
)