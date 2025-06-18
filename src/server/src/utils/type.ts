import { TokenResponse } from "@react-oauth/google";
import { Request } from "express";
import { IUser } from "../database/model/User.ts";

interface localLogin {
    type: 'local';
    data: {
        email: string;
        password: string;
    }
}

interface googleLogin {
    type: "google";
    data: Omit<TokenResponse, "error" | "error_description" | "error_uri">
}

interface lineLogin {
    type: "line";
    data: any
}
export type loginType = localLogin | googleLogin | lineLogin;

export interface googleProfile {
    id: string,
    email: string,
    verified_email: boolean,
    name: string,
    given_name: string,
    family_name: string,
    picture: string
}

export interface authCode {
    user_id: string,
    client_id: string
}

export type IRequest = Request & {user: IUser}