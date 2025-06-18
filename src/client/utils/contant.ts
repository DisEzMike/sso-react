// export const API_HOST = import.meta.env.PROD ? process.env.PROD_HOST : "http://localhost:" + process.env.PORT;
export const HOST = import.meta.env.PROD ? process.env.PROD_HOST : process.env.PROD_HOST;
export const AUTH_URL = HOST + "/oauth";
export const API_URL = HOST + "/api";