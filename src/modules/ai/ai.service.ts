import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ChatHistory, ChatHistoryDocument } from './schemas/chathistory.schema';
import { templates } from './templates/templates';

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
  async generateDocument(inputData: {
    userId: string;
    chatId: string;
    templateType: string;
    fields: { [key: string]: any };
  }): Promise<string> {
  
    const { userId, chatId, templateType, fields } = inputData;
  
    const chatHistory = await this.chatHistoryModel.findOne({ chatId }) as any;
    if (!chatHistory) {
      throw new Error('چت با این شناسه پیدا نشد.');
    }
  
    const templateConfig = templates[templateType];
    if (!templateConfig) {
      throw new Error(`قالبی با نوع '${templateType}' یافت نشد.`);
    }
  
    for (const field of templateConfig.requiredFields) {
      if (!(field in fields)) {
        throw new Error(`فیلد مورد نیاز '${field}' وجود ندارد.`);
      }
    }
  
    const promptContent = templateConfig.generate(fields);
  
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        ...chatHistory.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: promptContent },
      ],
    });
  
    const generatedText = response.choices[0]?.message?.content || '';
    await this.saveChatHistory(userId, chatId, promptContent, generatedText);
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
