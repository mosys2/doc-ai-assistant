import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { configurations } from './config/config';
import { MongooseDbConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AiModule } from './modules/ai/ai.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
      envFilePath:".env"
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseDbConfig,
    }),
    UserModule,
    AuthModule,
    JwtModule,
    AiModule,
    PaymentModule,
    
    // other modules
  ],
})
export class AppModule {}
