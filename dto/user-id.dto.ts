import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty({
    example: '001',
  })
  id: string;
}
