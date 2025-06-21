import { TokenResponse } from '@react-oauth/google';
import axios from 'axios';
import { AUTH_URL, HOST } from '../utils/contant';
import { authCode, RefreshToken, Token } from '../../server/src/utils/interfaces';

export const useGoogleLogin = async (data: any) => {
    return axios.post(AUTH_URL+"/authorize", {
        type: "google",
        data
    });
}

export const useLocalLogin = async (data: any) => {
    return axios.post(AUTH_URL+"/authorize", {
        type: "local",
        data
    });
}

export const getToken = async (arg: any) => {
    return axios.post(AUTH_URL+"/token", {
        ...arg,
    });
}

export const refreshToken = async (cb: any) => {
    const token = JSON.parse(localStorage.getItem('token')!);
    const refresh_token = token.refresh_token;
    const user_id = localStorage.getItem('user_id')!;
    const client_id = localStorage.getItem("client_id")!;
    const client_secret = localStorage.getItem("client_secret")!;

    const arg: RefreshToken = {
        grant_type: "refresh_token",
        client_id,
        client_secret,
        refresh_token,
        user_id
    }

    try {
       const response = await axios.post(AUTH_URL+"/token", {...arg}); 
       const data = response.data

       localStorage.setItem('token', JSON.stringify(data));
       console.log("refresh_token update")
       return cb();
    } catch (error) {
        console.error(error);

        window.location.href = HOST+`/oauth/logout?id_token_hint=${token.id_token}`;
    }
}

export const useSSOLogin = async (data: {client_id: string, redirect_uri: string}) => {
    return axios.post(AUTH_URL, {
        ...data
    })
}

export const logout = async (id_token: string) => {
    return axios.get(AUTH_URL+"/logout?id_token_hint="+id_token,);
}