import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Otp, OtpSchema } from './schemas/otp.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:User.name,schema:UserSchema},
      {name:Otp.name,schema:OtpSchema}
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
