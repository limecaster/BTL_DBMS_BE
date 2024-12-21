import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    example: '001',
  })
  orderId: string;
  @ApiProperty({
    example: '1000',
  })
  amount: number;
}
