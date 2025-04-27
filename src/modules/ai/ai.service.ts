import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ChatHistory, ChatHistoryDocument } from './schemas/chathistory.schema';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistoryDocument>,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OpenAi.apiKey'),
    });
  }

  async createChat(userId: string): Promise<{ chatId: string }> {
    const chatId = uuidv4();
    const newHistory = new this.chatHistoryModel({
      userId,
      chatId,
      messages: [],
    });
    await newHistory.save();
    return { chatId }; 
  }

  async chat(prompt: string, userId: string, chatId: string): Promise<string> {
    const chatHistory = await this.chatHistoryModel.findOne({ chatId })as any;
    if (!chatHistory) {
      throw new Error('چت با این شناسه پیدا نشد.');
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        ...chatHistory.messages.map(msg => ({
          role: msg.role,  
          content: msg.content,
        })),
        { role: 'user', content: prompt },
      ],
    });
    

    const generatedText = response.choices[0]?.message?.content || '';
    await this.saveChatHistory(userId, chatId, prompt, generatedText);
    return generatedText;
  }

  private async saveChatHistory(userId: string, chatId: string, userMessage: string, aiMessage: string): Promise<void> {
    const existingHistory = await this.chatHistoryModel.findOne({ chatId });

    if (existingHistory) {
      existingHistory.messages.push({ role: 'user', content: userMessage });
      existingHistory.messages.push({ role: 'assistant', content: aiMessage });
      await existingHistory.save();
    } else {
      const newHistory = new this.chatHistoryModel({
        userId,
        chatId,
        messages: [
          { role: 'user', content: userMessage },
          { role: 'assistant', content: aiMessage },
        ],
      });
      await newHistory.save();
    }
  }
}
