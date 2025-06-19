import { TokenResponse } from "@react-oauth/google";
import { Request } from "express";
import { IUser } from "../database/model/User.ts";

interface ProtoLoginType {
    data: {
        client_id: string;
        redirect_uri: string;
        state: string | null;
    }
}
interface localLogin extends ProtoLoginType {
    type: 'local';
    data: ProtoLoginType['data'] & {
        email: string;
        password: string;
    }
}

interface googleLogin extends ProtoLoginType {
    type: "google";
    data: ProtoLoginType['data'] & Omit<TokenResponse, "error" | "error_description" | "error_uri">
}

interface lineLogin {
    type: "line";
    data: ProtoLoginType['data'] & any
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

interface ProToTokenArg {
    client_id: string;
    client_secret: string;
}

interface Token extends ProToTokenArg {
    grant_type: "authorization_code";
    code: string;
    redirect_uri: string;
}

interface RefreshToken extends ProToTokenArg {
    grant_type: "refresh_token";
    refresh_token: string;
}

export type TokenType = Token | RefreshToken;
