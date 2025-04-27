import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateOtpDto } from "./dto/create-otp.dto";
import { CheckOtpDto } from "./dto/check-otp.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user/schemas/user.schema";
import { Model } from "mongoose";
import { Otp, OtpDocument } from "../user/schemas/otp.schema";
import { randomInt } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./types/payload";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Otp.name)
    private otpModel: Model<OtpDocument>,

    private jwtService:JwtService,
    private configService:ConfigService
  ) {}
  async createOtp(createOtpDto: CreateOtpDto) {
    const { mobile } = createOtpDto;
    let user = await this.userModel.findOne({ mobile });
    if (!user) {
      user = await this.userModel.create({
        mobile,
      });
    }
    await this.createOtpForUser(user);
    return {
      message: "send code to: " + user.mobile,
    };
  }

  async checkOtp(checkOtpDto: CheckOtpDto) {
    const { mobile, code } = checkOtpDto;
    const user = await this.userModel.findOne({ mobile });
    const now = new Date();
    if (!user) {
      throw new UnauthorizedException("کاربر یافت نشد.");
    }
    const otp = await this.otpModel.findOne({ user, code });
    if (!otp) {
      throw new UnauthorizedException("کد شما اشتباه است.");
    }
    if (otp.expiers_in < now) {
      throw new UnauthorizedException("کد شما منقضی شده است");
    }
    if (!user.isMobileVerified) {
      user.isMobileVerified = true;
      await user.save();
    }

    const {accessToken,refreshToken}= await this.generateToken({id:user.id,mobile:user.mobile})

    return {
      message:"ورود با موفقیت",
      accessToken,refreshToken
    };
  }

  async createOtpForUser(user) {
    const expierIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    const otp = await this.otpModel.findOne({ user });
    if (!otp) {
      this.otpModel.create({
        user,
        code,
        expiers_in: expierIn,
      });
    } else {
      if (otp.expiers_in > new Date()) {
        throw new BadRequestException("کد ارسالی منقضی نشده است");
      }
      otp.code = code;
      otp.expiers_in = expierIn;
    }
    await otp?.save();
  }

  async generateToken(payload:TokenPayload){
    const accessToken=this.jwtService.sign(payload,{
      secret:this.configService.get("Jwt.accessTokenSecret"),
      expiresIn:"30d"
    });

    const refreshToken=this.jwtService.sign(payload,{
      secret:this.configService.get("Jwt.refreshTokenSecret"),
      expiresIn:"90d"
    });

    return {accessToken,refreshToken}
  }
}
