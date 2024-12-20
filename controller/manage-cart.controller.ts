import { Body, Post } from "@nestjs/common";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ManageCartService } from "service/manage-cart.service"; 
import { SearchProductService } from "service/search-product.service";

@ApiTags('cart')
@Controller('cart')
export class ManageCartController {
    constructor(private readonly manageCartService: ManageCartService, private readonly searchProductService: SearchProductService) {}
  
    @Get(":userId")
    @ApiOperation({ summary: 'View all product in cart by userId' })
    @ApiResponse({ status: 200, description: 'Product found' })
    // http://127.0.0.1:3001/cart
    async viewDetailCart(@Param('userId') userId: string) {
      return (await this.manageCartService.viewCart(userId)).records.map(record => ({
        product: record.get('product'), 
        quantity: record.get('quantity') 
    }));
    }

    @Get("totalPrice/:userId")
    @ApiOperation({ summary: 'Get total price in cart' })
    @ApiResponse({ status: 200, description: 'Product found' })
    // http://127.0.0.1:3001/totalPrice/001
    async getTotalPrice(@Param('userId') userId: string) {
      return (await this.manageCartService.calTotalPrice(userId));
    }

    @Post('increase')
    @ApiOperation({ summary: 'Increase quantity of product (id) by 1' })
    @ApiResponse({ status: 200, description: 'Product found' })
    // curl -X POST http://127.0.0.1:3001/cart/increase -H "Content-Type: application/json" -d '{"userId": "001", "productId": }'
    async increaseQuantity(@Body('userId') userId: string, @Body('productId') productId: number) {
      return this.manageCartService.increaseQuantityProductInCart(productId, userId);
    }

    @Post('decrease')
    @ApiOperation({ summary: 'Decrease quantity of product (id) by 1' })
    @ApiResponse({ status: 200, description: 'Product found' })
    // curl -X POST http://127.0.0.1:3001/cart/decrease -H "Content-Type: application/json" -d '{"userId": "001", "productId": }'
    async decreaseQuantity(@Body('userId') userId: string, @Body('productId') productId: number) {
      return this.manageCartService.decreaseQuantityProductInCart(productId, userId);
    }

    @Post('delete')
    @ApiOperation({ summary: 'Delete product from cart' })
    @ApiResponse({ status: 200, description: 'Product found' })
    // curl -X POST http://127.0.0.1:3001/cart/delete -H "Content-Type: application/json" -d '{"userId": "001", "productId": }'
    async deleteQuantity(@Body('userId') userId: string, @Body('productId') productId: number) {
      return this.manageCartService.deleteProductFromCart(productId, userId);
    }

    
  }