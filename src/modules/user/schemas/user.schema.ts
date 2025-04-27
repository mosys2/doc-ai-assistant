// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // adds createdAt and updatedAt automatically
export class User {
  @Prop({ required: false })
  name: string;

  @Prop({ required: true, unique: true})
  mobile: string;

  @Prop({default:false})
  isMobileVerified:boolean
  
}

// This generates the Mongoose schema from the class
export const UserSchema = SchemaFactory.createForClass(User);
