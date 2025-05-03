import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Package } from './package.schema';
import { User } from 'src/modules/user/schemas/user.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {

  @Prop({ type: Boolean, default:false })
  status: boolean

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, required: false })
  refId:string

  @Prop({ type: String, required: false })
  authority:string

  @Prop({ type: String, required: true })
  customer_mobile: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'package' })
  package: Package;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
