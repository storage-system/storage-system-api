import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { UserPayload } from '@/infrastructure/auth/jwt.strategy'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'

import { HttpGetMetricsResponse } from '../../docs/metrics/http-get-metrics-response'
import { CurrentUserPipe } from '../../pipes/current-user-pipe'
import { MetricsService } from './metrics.service'

@ApiTags('Metrics')
@Controller('/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @ApiOkResponse({ type: HttpGetMetricsResponse })
  productMetrics(@CurrentUser(CurrentUserPipe) user: UserPayload) {
    return this.metricsService.findMetrics(user.companyId)
  }
}
