import { IsNotEmpty } from "class-validator";

export class ChatDto {
    @IsNotEmpty()
    prompt:string;

    @IsNotEmpty()
    chatId:string;
}
