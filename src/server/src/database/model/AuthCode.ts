import moment from 'moment';
import mongoose from 'mongoose';

export interface IAuthCode {
    code: string;
    client_id: string,
    user_id: string,
    redirect_uri: string,
    expiresAt: Date,
    removeIn: Date
}

const authCodeSchema = new mongoose.Schema<IAuthCode>({
  code: String,
  client_id: String,
  user_id: mongoose.Schema.Types.ObjectId,
  redirect_uri: String,
  expiresAt: Date,
  removeIn: {
    type: Date,
    default: moment(),
    expires: '10s'
  }
});

export const AuthCode = mongoose.model<IAuthCode>('AuthCode', authCodeSchema);