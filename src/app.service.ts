import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import  OpenAI from 'openai';
config()

@Injectable()
export class AppService {
  private openai:OpenAI;
  constructor(){
    this.openai=new OpenAI({
      apiKey:process.env.OPENAI_API_KEY
    })
  }
  async generateText(prompt: string): Promise<string> {
    if (typeof prompt !== 'string') {
      throw new Error('Invalid prompt: not a string');
    }
    console.log(prompt)
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
  
    return response.choices[0]?.message?.content || '';
  }
  
  
  
}
