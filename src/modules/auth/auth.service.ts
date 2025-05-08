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
import { ResultDto } from "src/common/Dtos/ResultDto.dto";
import  {sendOtpSms} from "src/services/melipayamak";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Otp.name)
    private otpModel: Model<OtpDocument>,

    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  async createOtp(createOtpDto: CreateOtpDto): Promise<ResultDto> {
    const { mobile } = createOtpDto;
    let user = await this.userModel.findOne({ mobile });
    if (!user) {
      user = await this.userModel.create({
        mobile,
      });
    }
    const code = await this.createOtpForUser(user);
    if(process.env.NODE_ENV =='production'){
      await sendOtpSms(user.mobile, code);
    }
    return {
      isSuccess: true,
      message: "send code to: " + user.mobile + "your code is: " + code,
    };
  }

  async checkOtp(checkOtpDto: CheckOtpDto): Promise<ResultDto<Object>> {
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

    const { accessToken, refreshToken } = await this.generateToken({
      id: user.id,
      mobile: user.mobile,
    });

    return {
      isSuccess: true,
      message: "ورود با موفقیت",
      data: { id: user.id, accessToken, refreshToken, mobile: user.mobile },
    };
  }

  async createOtpForUser(user) {
    const expierIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.otpModel.findOne({ user });
    if (!otp) {
      otp = await this.otpModel.create({
        user,
        code,
        expiers_in: expierIn,
      });
    } else {
      if (otp.expiers_in > new Date()) {
        throw new BadRequestException("پس از 2 دقیقه دوباره تلاش کنید");
      }
      otp.code = code;
      otp.expiers_in = expierIn;
    }
    await otp?.save();
    console;
    return code;
  }

  async generateToken(payload: TokenPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("Jwt.accessTokenSecret"),
      expiresIn: "30d",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("Jwt.refreshTokenSecret"),
      expiresIn: "90d",
    });

    return { accessToken, refreshToken };
  }

  async validationAccessToken(token) {
    try {
      const payload = this.jwtService.verify<TokenPayload>(token, {
        secret: this.configService.get("Jwt.accessTokenSecret"),
      });
      if (typeof payload == "object" && payload?.id) {
        const user = await this.userModel.findById(payload.id);
        if (!user) {
          throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید");
        }
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException("لطفا وارد حساب کاربری خود شوید");
    }
  }
}
