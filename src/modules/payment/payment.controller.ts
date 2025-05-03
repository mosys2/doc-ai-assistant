import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { ResultDto } from 'src/common/Dtos/ResultDto.dto';

@Controller('payment')
@UseGuards(AuthGuard)

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment')
  @ApiResponse({type:ResultDto})
  async createPayment(@Req()request:Request,@Body()createPaymentDto:CreatePaymentDto){
    const {user}=request as any
    return this.paymentService.createPayment(user.id,createPaymentDto.packageId)
  }

 
}
