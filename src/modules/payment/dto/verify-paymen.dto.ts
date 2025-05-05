import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyPaymentDto {
  @IsNotEmpty()
  @ApiProperty()
  authority: string;

  @IsNotEmpty()
  @ApiProperty()
  status: string;
}
