import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsMobilePhone, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMobilePhone("fa-IR")
  mobile: string;

}
