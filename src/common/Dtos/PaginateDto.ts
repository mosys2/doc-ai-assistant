import { IsNotEmpty, IsNumber } from "class-validator";

export class PaginateDto{
    @IsNotEmpty()
    page;

    @IsNotEmpty()
    limit:11;
}