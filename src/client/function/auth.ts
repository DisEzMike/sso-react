import { TokenResponse } from '@react-oauth/google';
import axios from 'axios';
// export const API_HOST = import.meta.env.PROD ? process.env.PROD_HOST : "http://localhost:" + process.env.PORT;
export const API_HOST = import.meta.env.PROD ? process.env.PROD_HOST : process.env.PROD_HOST;
const API_URL = API_HOST + "/oauth";

export const useGoogleLogin = async (data: any) => {
    return axios.post(API_URL+"/login", {
        type: "google",
        data
    });
}