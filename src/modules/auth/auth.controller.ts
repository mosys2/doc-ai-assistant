import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOtpDto } from './dto/create-otp.dto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResultDto } from 'src/common/Dtos/ResultDto.dto';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create-otp')
  @ApiResponse({type:ResultDto<Object>})
  createOtp(@Body() createOtpDto: CreateOtpDto) {
    return this.authService.createOtp(createOtpDto);
  }

  @Post('check-otp')
  @ApiResponse({type:ResultDto<Object>})
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto);
  }
}
