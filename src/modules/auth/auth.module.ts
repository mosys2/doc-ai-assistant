import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Otp, OtpSchema } from '../user/schemas/otp.schema';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[MongooseModule.forFeature([
    {name:User.name,schema:UserSchema},
    {name:Otp.name,schema:OtpSchema}
  ])],
  controllers: [AuthController],
  providers: [AuthService,JwtService],
})
export class AuthModule {}
