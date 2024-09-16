import { Controller, Get, Param } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Metrics')
@Controller('/metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}
  
  @Get('/:userId')
  productMetrics(
    @Param('userId') userId: string,
  ) {
    return this.metricsService.findMetrics(
      userId,
    );
  }
}
