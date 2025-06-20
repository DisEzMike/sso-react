import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const signToken = (payload: object, expiresIn?: any) => {
    if (!expiresIn) expiresIn = '1d';
    return jwt.sign(payload, JWT_SECRET, {expiresIn});
};

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
