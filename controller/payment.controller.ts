import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePaymentDto } from 'dto/payment.dto';
import { UpdateOrderStatusDto } from 'dto/update-status-order.dto';
import { UserIdDto } from 'dto/user-id.dto';
import { PaymentService } from 'service/payment.service';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create payment',
  })
  @ApiResponse({ status: 200, description: 'Payment created' })

  // curl -X POST http://127:0.0.1:3001/payment/create/
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto.orderId, dto.amount);
  }
}
