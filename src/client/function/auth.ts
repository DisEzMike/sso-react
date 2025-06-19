import { TokenResponse } from '@react-oauth/google';
import axios from 'axios';
import { AUTH_URL } from '../utils/contant';
import { Token } from '../../server/src/utils/interfaces';

export const useGoogleLogin = async (data: any) => {
    return axios.post(AUTH_URL+"/login", {
        type: "google",
        data
    });
}

export const getToken = async (arg: Token) => {
    return axios.post(AUTH_URL+"/token", {
        ...arg,
    });
}