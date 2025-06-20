import jwt from 'jsonwebtoken';
import { authCode } from "./interfaces.ts";
import { User } from '../database/model/User.ts';
import { AuthCode } from '../database/model/AuthCode.ts';
import { generateCode } from './cryptoUtils.ts';
import moment from 'moment';

export const createToken = (payload: any, expiresIn?: any) => {
	if (!expiresIn) expiresIn = '1d';
	return jwt.sign(payload, process.env.JWT_SECRET!, {
		expiresIn
	});
};

export function verifyToken(token: string) {
	return jwt.verify(token, process.env.JWT_SECRET!);
};

export const getAuthCode = async (data: {user_id: string, client_id: string, redirect_uri: string}) => {
	const {user_id, client_id, redirect_uri} = data;
	const authCode = new AuthCode({
		code: generateCode(),
		user_id,
		client_id,
		redirect_uri,
		expiresAt: moment().add(1, 'month')
	});
	await authCode.save()
	return authCode
}