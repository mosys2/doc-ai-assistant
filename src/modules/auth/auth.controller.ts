import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-otp')
  createOtp(@Body() createOtpDto: CreateOtpDto) {
    return this.authService.createOtp(createOtpDto);
  }

  @Post('check-otp')
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto);
  }

 
}
