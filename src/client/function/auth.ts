import { TokenResponse } from '@react-oauth/google';
import axios from 'axios';
import { AUTH_URL } from '../utils/contant';
import { authCode, RefreshToken, Token } from '../../server/src/utils/interfaces';

export const useGoogleLogin = async (data: any) => {
    return axios.post(AUTH_URL+"/login", {
        type: "google",
        data
    });
}

export const useLocalLogin = async (data: any) => {
    return axios.post(AUTH_URL+"/login", {
        type: "local",
        data
    });
}

export const getToken = async (arg: Token) => {
    return axios.post(AUTH_URL+"/token", {
        ...arg,
    });
}

export const refreshToken = async (cb: any) => {
    const user_id = localStorage.getItem("user_id")!;
    const client_id = localStorage.getItem("client_id")!;
    const client_secret = localStorage.getItem("client_secret")!;
    const refresh_token = localStorage.getItem("refresh_token")!;

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

       sessionStorage.setItem('token', data.access_token);
       localStorage.setItem('refresh_token', data.refresh_token);
       console.log("refresh_token update")
       return cb();
    } catch (error) {
        console.error(error)
    }
}

export const useSSOLogin = async (data: {client_id: string, redirect_uri: string}) => {
    return axios.post(AUTH_URL, {
        ...data
    })
}