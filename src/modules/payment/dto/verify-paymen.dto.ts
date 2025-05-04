import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyPaymentDto {
  @IsNotEmpty()
  @ApiProperty()
  Authority: string;

  @IsNotEmpty()
  @ApiProperty()
  Status: string;
}
