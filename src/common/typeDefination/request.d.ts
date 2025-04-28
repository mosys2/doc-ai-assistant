import { User } from "src/modules/user/schemas/user.schema";

declare global {
   namespace Express { 
        export interface Request{
            user?:User
        }
    }
} 