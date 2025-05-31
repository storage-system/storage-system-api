import { CurrentUser } from '@/infrastructure/decorators/current-user.decorator'
import { UserPayload } from '@/infrastructure/auth/jwt.strategy'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'

import { StockGeneralMetricsResponseDto } from '../../docs/metrics/http-stock-general-metrics-response'
import { HttpGetMetricsResponse } from '../../docs/metrics/http-get-metrics-response'
import { CurrentUserPipe } from '../../pipes/current-user-pipe'
import { MetricsService } from './metrics.service'

@ApiTags('Metrics')
@Controller('/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('/old-stock')
  @ApiOkResponse({ type: HttpGetMetricsResponse })
  productMetrics(@CurrentUser(CurrentUserPipe) user: UserPayload) {
    return this.metricsService.findOldStockMetrics(user.companyId)
  }

  @Get('/stock-general')
  @ApiOkResponse({ type: StockGeneralMetricsResponseDto })
  stockGeneralMetrics(@CurrentUser(CurrentUserPipe) user: UserPayload) {
    return this.metricsService.findStockGeneralMetrics(user.companyId)
  }
}
