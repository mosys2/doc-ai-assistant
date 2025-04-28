import { IsNotEmpty, IsObject } from "class-validator";

export class ChatDto {
    @IsNotEmpty()
    prompt:string;

    @IsNotEmpty()
    chatId:string;

    @IsNotEmpty()
    templateType:string

    @IsObject()
    fields:object
}
