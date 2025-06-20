import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './contant.ts';

export const signToken = (payload: any, expiresIn?: any) => {
    if (!expiresIn) expiresIn = '1d';
    return jwt.sign(payload, JWT_SECRET, {expiresIn});
};

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
