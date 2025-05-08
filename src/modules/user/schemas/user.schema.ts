// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Package } from 'src/modules/payment/schemas/package.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // adds createdAt and updatedAt automatically
export class User {
  @Prop({ required: false })
  name: string;

  @Prop({ required: true, unique: true})
  mobile: string;

  @Prop({default:false})
  isMobileVerified:boolean

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: '68162d73a39f3fb92bd9c8d5' })
  currentPackage: Package;
  
}

// This generates the Mongoose schema from the class
export const UserSchema = SchemaFactory.createForClass(User);
