import mongoose from 'mongoose';

export interface IAuthCode {
    code: string;
    client_id: string,
    userId: string,
    redirect_uri: string,
    expiresAt: Date
}

const authCodeSchema = new mongoose.Schema<IAuthCode>({
  code: String,
  client_id: String,
  userId: mongoose.Schema.Types.ObjectId,
  redirect_uri: String,
  expiresAt: Date,
});

export const AuthCode = mongoose.model<IAuthCode>('AuthCode', authCodeSchema);