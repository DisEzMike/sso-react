import jwt from 'jsonwebtoken';
import { authCode } from "./interfaces.ts";
import { User } from '../database/model/User.ts';

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