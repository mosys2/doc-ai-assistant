import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { ResultDto } from 'src/common/Dtos/ResultDto.dto';
import { VerifyPaymentDto } from './dto/verify-paymen.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('packages')
  @ApiResponse({type:Array})
  async getAllPackage(){
    return this.paymentService.getAllPackage();
  }

  @Post('create-payment')
  @UseGuards(AuthGuard)
  @ApiResponse({type:ResultDto})
  async createPayment(@Req()request:Request,@Body()createPaymentDto:CreatePaymentDto){
    const {user}=request as any
    return this.paymentService.createPayment(user.id,createPaymentDto.packageId)
  }

  @Get('verify-payment')
  @UseGuards(AuthGuard)
  @ApiResponse({type:ResultDto})
  async verifyPayment(@Query()query:VerifyPaymentDto){ 
    const {authority,status}=query;
   return this.paymentService.verifyPayment(authority)
  }
 
}
