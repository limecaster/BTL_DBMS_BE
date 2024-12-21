// user.dto.ts
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'The unique username for the user' })
  username: string;

  @ApiProperty({ description: 'The password for the user' })
  password: string;

  @ApiProperty({ description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ description: 'The last name of the user' })
  lastName: string;

  @ApiProperty({ description: 'The email address of the user' })
  email: string;

  @ApiProperty({ description: 'The city where the user resides' })
  city: string;

  @ApiProperty({ description: 'The state where the user resides' })
  states: string;

  // optional for phone
  @ApiProperty({ description: 'The phone number of the user' })
  phone: string;
}


export class RegisterUserWithoutPasswordDto extends OmitType(RegisterUserDto, ['password'] as const) {}


export class LoginUserDto {
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @ApiProperty({ description: 'The password of the user' })
  password: string;
}
