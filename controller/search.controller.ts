import { Body } from "@nestjs/common";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SearchProductService } from "service/search-product.service";

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchProductService: SearchProductService) {}

  @Get()
  @ApiOperation({ summary: 'Full-text search for products by name' })
  @ApiBody({ description: 'Name of the product to search for' })
  @ApiResponse({ status: 200, description: 'List of products found' })
  // curl -X GET "http://localhost:3001/search?name=AMD?page=1?limit=20" -H "accept: application/json" -H "Content-Type: application/json" 
  async searchProducts(
    @Query('name') name: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (!name) {
      throw new Error('Name query parameter is required');
    }
    return await this.searchProductService.searchProduct(name, pageNum, limitNum);
  }
}