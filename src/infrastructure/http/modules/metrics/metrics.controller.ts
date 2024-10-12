import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { MetricsService } from './metrics.service'

@ApiTags('Metrics')
@Controller('/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get('/:userId')
  productMetrics(@Param('userId') userId: string) {
    return this.metricsService.findMetrics(userId)
  }
}
