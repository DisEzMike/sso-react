import { config } from "dotenv";

config();

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT
export const DB_DATABASE = process.env.DB_DATABASE

export const DB_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`

export const HOST = process.env.NODE_ENV == "production" ? process.env.PROD_HOST : process.env.DEV_HOST;