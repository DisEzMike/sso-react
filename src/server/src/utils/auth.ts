import { AuthCode } from '../database/model/AuthCode.ts';
import { generateCode } from './cryptoUtils.ts';
import moment from 'moment';

export const getAuthCode = async (data: {user_id: string, client_id: string, redirect_uri: string, scope: string;}) => {
	const {user_id, client_id, redirect_uri, scope} = data;
	const authCode = new AuthCode({
		code: generateCode(),
		user_id,
		client_id,
		redirect_uri,
		expiresAt: moment().add(1, 'month'),
		scope: scope
	});
	await authCode.save()
	return authCode
}