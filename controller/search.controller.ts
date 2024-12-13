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
  // curl -X GET http://127.0.0.1:3001/search -H "Content-Type: application/json" -d '{"name": "AMD Ryzen 7"}'
  async searchProduct(@Body('name') name: string) {
    return (await this.searchProductService.searchProduct(name)).records.map((record) => record.get('node').properties);
  }
}