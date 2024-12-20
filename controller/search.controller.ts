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
  // curl -X GET "http://localhost:3001/search?name=AMD" -H "accept: application/json" -H "Content-Type: application/json" 
  async searchProductByName(@Query('name') name: string) {
    return (await this.searchProductService.searchProduct(name)).records.map(record => record.get('node').properties);
  }
}