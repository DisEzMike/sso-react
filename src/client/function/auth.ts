import { TokenResponse } from '@react-oauth/google';
import axios from 'axios';
import { AUTH_URL } from '../utils/contant';

export const useGoogleLogin = async (data: any) => {
    return axios.post(AUTH_URL+"/login", {
        type: "google",
        data
    });
}

export const getToken = async (code: string) => {
    return axios.post(AUTH_URL+"/token", {
        code,
        grant_type: 'authorization_code'
    });
}