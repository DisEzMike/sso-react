import jwt from 'jsonwebtoken';
import { authCode } from "./interfaces.ts";
import { User } from '../database/model/User.ts';
import { AuthCode } from '../database/model/AuthCode.ts';
import { generateCode } from './cryptoUtils.ts';
import moment from 'moment';

export const getToken = async (code: string) => {
	const authCode = jwt.verify(code, process.env.JWT_SECRET!) as authCode;

	const user = await User.findByIdAndUpdate(authCode.user_id);

	const access_token = createToken({user});

	return {
		access_token,
		token_type: 'Bearer',
		expires_in: 24 * 60 * 60,
	};
};

export const createToken = (payload: any, expiresIn?: any) => {
	if (!expiresIn) expiresIn = '1d';
	return jwt.sign(payload, process.env.JWT_SECRET!, {
		expiresIn
	});
}

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