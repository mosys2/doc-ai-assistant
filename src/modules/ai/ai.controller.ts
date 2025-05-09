import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { ResultDto } from 'src/common/Dtos/ResultDto.dto';

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('create-chat')
  @ApiResponse({type:ResultDto<Object>})
  createChat(@Req()request:Request,@Body('prompt') prompt: string) {
    const {user}=request as any
    return this.aiService.createChat(user.id);
  }

  @Post('chat')
  @ApiResponse({type:ResultDto<Object>})
  chat(@Req()request:Request,@Body() chatDto: ChatDto) {
    const {user}=request as any
    const { chatId, templateType, fields } = chatDto;
    return this.aiService.generateDocument({
      userId:user.id,
      chatId,
      templateType,
      fields
    });
  }
  
}
