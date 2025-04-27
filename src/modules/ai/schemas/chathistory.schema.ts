import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatHistoryDocument = ChatHistory & Document;

@Schema({ timestamps: true })
export class ChatHistory {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  chatId: string;

  @Prop({ type: [{ role: String, content: String }], default: [] })
  messages: { role: string; content: string }[];
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
