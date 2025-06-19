export const HOST = import.meta.env.PROD ? process.env.PROD_HOST : process.env.DEV_HOST;
export const AUTH_URL = HOST + "/oauth";
export const API_URL = HOST + "/api";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;