import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateOrderStatusDto } from 'dto/update-status-order.dto';
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

  @Post('update-status')
  @ApiOperation({
    summary: 'Update status of order',
  })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  async updateStatus(@Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(dto.orderId, dto.status);
  }
}
