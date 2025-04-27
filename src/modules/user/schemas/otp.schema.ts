import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import mongoose from "mongoose";

export type OtpDocument = Otp & Document;

@Schema({ timestamps: true })
export class Otp {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  })
  user: User;

  @Prop({ required: true })
  code: string;

  @Prop()
  expiers_in: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
