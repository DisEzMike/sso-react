import { TokenResponse } from '@react-oauth/google';
import axios from 'axios';
const API_URL = process.env.PROD_HOST + "/api"

export const useGoogleLogin = async (data: any) => {
    return axios.post(API_URL+"/login", {
        type: "google",
        data
    });
}