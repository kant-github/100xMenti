import { ISODateString } from "next-auth";
import { UserType } from "../../app/api/auth/[...nextauth]/options";

export interface CustomSession {
    user?: UserType;
    expires: ISODateString;
}