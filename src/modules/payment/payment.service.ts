import {
  BadRequestException,
  HttpCode,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Model } from "mongoose";
import { User, UserDocument } from "../user/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Package, PackageDocument } from "./schemas/package.schema";
import { Transaction, TransactionDocument } from "./schemas/transaction.schema";
import { ResultDto } from "src/common/Dtos/ResultDto.dto";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { BadRequestError } from "openai";

// http://localhost:3000/payment/callback?Authority=A0000000000000000000000000006qd3nmwj&Status=NOK

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Package.name)
    private packageModel: Model<PackageDocument>,

    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>
  ) {}

  async createPayment(
    userId: string,
    packageId: string
  ): Promise<ResultDto<Object>> {
    try {
      const findUser = await this.userModel.findById(userId);
      const findPackage = await this.packageModel.findById(packageId);
      if (!findUser) {
        throw new NotFoundException("کاربر یافت نشد");
      }
      if (!findPackage) {
        throw new NotFoundException("پلن یافت نشد");
      }

      const transaction = await this.transactionModel.create({
        user: findUser,
        amount: findPackage.price,
        status: false,
        package: findPackage,
        customer_mobile: findUser.mobile,
      });

      const result = await this.zarinpalRequest(transaction.amount, findUser);
      if (result?.data?.authority) {
        transaction.authority = result?.data?.authority;
        await transaction.save();
        const paymentUrl = `${process.env.ZARINPAL_GATEWAY_URL}/${result?.data?.authority}`;
        return {
          isSuccess: true,
          data: {
            paymentUrl,
          },
        };
      }
      throw new Error("سرویس پرداخت در دسترس نیست");
    } catch (error) {
      return {
        isSuccess: false,
        message: error?.message || "خطا در ایجاد پرداخت",
      };
    }
  }

  async verifyPayment(authority): Promise<ResultDto<Object>> {
    try {
      const transaction = await this.transactionModel.findOne({ authority });
      if (!transaction) {
        throw new NotFoundException("پرداخت یافت نشد.");
      }
      console.log(transaction);
      const result = await this.zarinpalVerify(transaction.amount, authority);
      if (result.data.code === 100) {
        transaction.status = true;
        await transaction.save();
        return {
          isSuccess: true,
          message: "پرداخت با موفقیت انجام شد",
        };
      } else if (result.data.code === 101) {
        return {
          isSuccess: true,
          message: "پرداخت قبلا انجام شده است",
        };
      }
      throw new Error("پرداخت انجام نشده است");
    } catch (error) {
      return {
        isSuccess: false,
        message: error?.message || "پرداخت انجام نشده است",
      };
    }
  }

  async zarinpalRequest(amount, user, description = "buy") {
    console.log(process.env.ZARINPAL_REQUEST_URL);
    try {
      const result = await axios.post(
        process.env.ZARINPAL_REQUEST_URL as string,
        {
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          callback_url: process.env.ZARINPAL_CALLBACK_URL,
          amount,
          description,
          metadata: {
            email: "example@gmail.com",
            mobile: user.mobile,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result.data;
    } catch (error) {
      throw new Error(error.message || "خطا در ایجاد لینک پرداخت");
    }
  }

  async zarinpalVerify(amount, authority) {
    try {
      const result = await axios.post(
        process.env.ZARINPAL_VERIFY_URL as string,
        {
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          authority,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result.data;
    } catch (error) {
      throw new Error(error.message || "خطا در پردازش پرداخت");
    }
  }
}
