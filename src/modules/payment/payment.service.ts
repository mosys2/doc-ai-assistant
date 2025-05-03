import { BadRequestException, HttpCode, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { User, UserDocument } from "../user/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Package, PackageDocument } from "./schemas/package.schema";
import { Transaction, TransactionDocument } from "./schemas/transaction.schema";
import { ResultDto } from "src/common/Dtos/ResultDto.dto";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { BadRequestError } from "openai";

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Package.name)
    private packageModel: Model<PackageDocument>,

    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
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
      const result=await this.zarinpalRequest(transaction.amount,findUser);
      if(result?.data?.authority){
        const paymentUrl= `${process.env.ZARINPAL_GATEWAY_URL}/${result?.data?.authority}`
        return {
          isSuccess: true,
          data: {
            paymentUrl
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

  async zarinpalRequest(amount, user,description='buy') {
    console.log(process.env.ZARINPAL_REQUEST_URL)
    try {
      const result =await axios.post(
        process.env.ZARINPAL_REQUEST_URL as string,
        {
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          callback_url: process.env.ZARINPAL_CALLBACK_URL,
          amount,
          description,
          metadata: {
            email:"example@gmail.com",
            mobile: user.mobile,
          },
        },{
            headers:{
                "Content-Type":"application/json"
            }
        }
      );
      return result.data
    } catch (error) {
        console.log(error)
    }
  }
}
