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
        username: string;
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

export type IRequest = Request & {user: IUser, token: AccessToken}

interface ProToTokenArg {
    client_id: string;
    client_secret: string;
}

export interface Token extends ProToTokenArg {
    grant_type: "authorization_code";
    code: string;
    redirect_uri: string;
    scope: string[]
}

export interface RefreshToken extends ProToTokenArg {
    grant_type: "refresh_token";
    refresh_token: string;
    user_id: string;
}

export type TokenType = Token | RefreshToken;

export interface AccessToken {
    sub: string;
    client_id: string;
    email: string;
    scope: string
}
