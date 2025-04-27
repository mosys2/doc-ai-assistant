import { IsMobilePhone, IsNotEmpty, IsString, isString } from "class-validator";

export class CreateOtpDto {
    @IsNotEmpty()
    @IsMobilePhone("fa-IR")
    @IsString()
    mobile:string
}
