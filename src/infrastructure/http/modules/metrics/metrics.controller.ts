import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Param } from '@nestjs/common'

import { HttpGetMetricsResponse } from '../../docs/metrics/http-get-metrics-response'
import { MetricsService } from './metrics.service'

@ApiTags('Metrics')
@Controller('/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('/company/:companyId')
  @ApiOkResponse({ type: HttpGetMetricsResponse })
  productMetrics(@Param('companyId') companyId: string) {
    return this.metricsService.findMetrics(companyId)
  }
}
