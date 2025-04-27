import { IsMobilePhone, IsNotEmpty, IsString, isString, Length, Max, Min } from "class-validator";

export class CheckOtpDto {
    @IsNotEmpty()
    @IsMobilePhone("fa-IR")
    @IsString()
    mobile:string

    @IsNotEmpty()
    @Length(5,5)
    @IsString()
    code:string
}
