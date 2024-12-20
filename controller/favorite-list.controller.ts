import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { FavoriteListService } from 'service/favorite-list.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Favorite List')
@Controller('favorite-list')
export class FavoriteListController {
  constructor(private readonly favoriteListService: FavoriteListService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get favorite list' })
  @ApiResponse({ status: 200, description: 'Return favorite list' })
  async getFavoriteList(
    @Param('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.favoriteListService.getFavoriteList(userId, pageNum, limitNum);
  }

  @Post(':userId/:productId')
  @ApiOperation({ summary: 'Add to favorite list' })
  @ApiResponse({ status: 200, description: 'Return added product to favorite list' })
  async addToFavoriteList(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.favoriteListService.addToFavoriteList(userId, productId);
  }

  @Delete(':userId/:productId')
  @ApiOperation({ summary: 'Remove from favorite list' })
  @ApiResponse({ status: 200, description: 'Return removed product from favorite list' })
  async removeFromFavoriteList(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.favoriteListService.removeFromFavoriteList(userId, productId);
  }
}
