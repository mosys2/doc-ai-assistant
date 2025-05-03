import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { UserModule } from "../user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../user/schemas/user.schema";
import { Package, PackageSchema } from "./schemas/package.schema";
import { Transaction, TransactionSchema } from "./schemas/transaction.schema";
import { AuthModule } from "../auth/auth.module";
import { PaymentService } from "./payment.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule, // Ensure ConfigModule is imported
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Package.name, schema: PackageSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
