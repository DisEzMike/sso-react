import { TokenResponse } from '@react-oauth/google';
import axios from 'axios';
const API_URL = import.meta.env.PROD ? process.env.PROD_URL + "/api" : `http://localhost:${process.env.PORT}/api`;

export const useGoogleLogin = async (data: Omit<TokenResponse, "error" | "error_description" | "error_uri">) => {
    return axios.post(API_URL+"/login", {
        type: "google",
        data
    });
}