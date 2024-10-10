import { ApiProperty } from '@nestjs/swagger'

export class HttpSuccessResponse {
  @ApiProperty({ type: Boolean })
  success = true
}
