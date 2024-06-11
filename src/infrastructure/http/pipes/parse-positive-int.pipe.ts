import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { fromZodError } from 'zod-validation-error'
import { ZodError, z } from 'zod'

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  constructor(public defaultValue: number = 1) {}

  transform(value: string, meta: ArgumentMetadata) {
    const schema = z
      .preprocess((v) => parseInt(String(v)), z.number().min(0).optional())
      .default(this.defaultValue)

    try {
      const parsed = schema.parse(value, {
        path: [String(meta.data)],
      })

      return parsed
    } catch (e) {
      if (e instanceof ZodError) {
        throw new BadRequestException({
          errors: fromZodError(e),
          message: 'Validation failed',
          statusCode: 400,
        })
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
