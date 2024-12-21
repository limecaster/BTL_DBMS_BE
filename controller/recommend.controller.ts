import { Controller, Get, Param } from '@nestjs/common';
import { RecommendService } from 'service/recommend.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Recommend')
@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Get(':productId')
  @ApiOperation({ summary: 'Get recommended products' })
  @ApiResponse({ status: 200, description: 'Return recommended products' })
  async recommendProducts(@Param('productId') productId: string) {
    return this.recommendService.recommendProducts(productId);
  }
}
