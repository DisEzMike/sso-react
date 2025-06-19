import mongoose from 'mongoose';

export interface IRefreshToken {
  token: string;
  user_id: string;
  client_id: string;
  expiresAt: Date;
}

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  token: String,
  user_id: mongoose.Schema.Types.ObjectId,
  client_id: String,
  expiresAt: Date,
});

export const RefreshToken = mongoose.model<IRefreshToken>('refreshtokens', refreshTokenSchema);