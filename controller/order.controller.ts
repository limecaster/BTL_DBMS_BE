import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserIdDto } from 'dto/user-id.dto';
import { OrderService } from 'service/order.service';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create order with carts of user',
  })
  @ApiProperty({
    example: '001',
  })
  @ApiResponse({ status: 200, description: 'Order created' })

  // curl -X POST http://127:0.0.1:3001/order/create/
  async createOrder(@Body() userId: UserIdDto) {
    return this.orderService.createOrder(userId);
  }
}
