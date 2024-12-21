import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from 'service/user.service';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterUserDto, LoginUserDto, RegisterUserWithoutPasswordDto } from 'dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, invalid input data',
  })
  async createUser(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.createUser(registerUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  @Post(':id/update')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: RegisterUserWithoutPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'User profile updated',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUser(@Param('id') id: number, @Body() registerUserWithoutPasswordDto: RegisterUserWithoutPasswordDto) {
    return this.userService.updateUserProfileById(id, registerUserWithoutPasswordDto);
  }

  @Get(':id/profile')
  @ApiOperation(({ summary: 'Get user profile' }))
  @ApiResponse({
    status: 200,
    description: 'User profile found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getProfile(@Param('id') id: number) {
    return this.userService.getUserProfileById(id);
  }
}
