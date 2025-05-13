import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type PackageDocument = HydratedDocument<Package>;

@Schema({ timestamps: true })
export class Package {
  @Prop({ type: String, required: true })
  @ApiProperty()
  title: string;

  @Prop({ type: String, required: true })
  @ApiProperty()
  name: string;

  @Prop({ type: Number, required: true })
  @ApiProperty()
  price: number;

  @Prop({ type: Boolean, default: true })
  @ApiProperty()
  active: boolean;

  @Prop({ type: Array })
  @ApiProperty()
  data: [];

  @Prop({ type: String })
  @ApiProperty()
  env: string;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
