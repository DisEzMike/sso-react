import { TokenResponse } from "@react-oauth/google";

type localLogin = {
    type: 'local';
    data: {
        email: string;
        password: string;
    }
}

type googleLogin = {
    type: "google";
    data: TokenResponse
}

type lineLogin = {
    type: "line";
    data: any
}
export type loginType = localLogin | googleLogin | lineLogin;
