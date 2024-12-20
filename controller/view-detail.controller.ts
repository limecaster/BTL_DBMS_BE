import { Body, Post } from "@nestjs/common";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ManageCartService } from "service/manage-cart.service"; 
import { DetailProductService } from "service/detail-product.service"; 

@ApiTags('detail')
@Controller('detail')
export class ViewDetailController {
    constructor(private readonly manageCartService: ManageCartService, private readonly detailProductService: DetailProductService) {}

    @Get(":productId")
    @ApiOperation({ summary: 'Search for a product by index' })
    @ApiResponse({ status: 200, description: 'Product found' })
    // http://127.0.0.1:3001/detail/8dd92bff-a5f9-4d12-81ea-19ad591ba7e6
    async detailProduct(@Param('productId') index: string) {
      return (await (this.detailProductService.detailProduct(index))).records[0].get('node');
    }

    @Post()
    @ApiOperation({ summary: 'Add product to cart, quanity x' })
    @ApiBody({ description: 'Id of the product, User ID, Quantity of product' })
    @ApiResponse({ status: 200, description: 'Add to Cart' })
    // curl -X POST http://127.0.0.1:3001/detail -H "Content-Type: application/json" -d '{"userId": "001", "productId": 20466, "quantity": 2}'
    async addToCart(@Body('userId') userId: string, @Body('productId') productId: string, @Body('quantity') quantity: number) {
      return this.manageCartService.addProductToCart(productId, quantity, userId);
    }



  }