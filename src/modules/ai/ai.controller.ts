import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('create-chat')
  createChat(@Body('prompt') prompt: string) {
    const userId='680e222f57e7deb2eb79289c'
    return this.aiService.createChat(userId);
  }

  @Post('chat')
  chat(@Body() chatDto: ChatDto) {
    const userId='680e222f57e7deb2eb79289c'
    return this.aiService.chat(chatDto.prompt,userId,chatDto.chatId);
  }
}
