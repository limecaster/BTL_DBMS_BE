import { Body } from "@nestjs/common";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { SearchProductService } from "service/search-product.service";

@Controller('search')
export class SearchController {
  constructor(private readonly searchProductService: SearchProductService) {}

  @Get()
  async searchProduct(@Body('name') name: string) {
    return (await this.searchProductService.searchProduct(name)).records.map((record) => record.get('node').properties);
  }
}