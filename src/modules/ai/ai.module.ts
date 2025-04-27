import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatHistory, ChatHistorySchema } from './schemas/chathistory.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:ChatHistory.name,schema:ChatHistorySchema}
    ])
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
