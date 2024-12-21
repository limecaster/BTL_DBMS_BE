import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: '001',
  })
  orderId: string;

  @ApiProperty({
    example: 'DELIVERED',
  })
  status: string;
}
