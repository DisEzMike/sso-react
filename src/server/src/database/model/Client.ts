import mongoose from 'mongoose';

export interface IClient {
    client_id: string;
    client_secret: string,
    redirectUris: string[]
}

const clientSchema = new mongoose.Schema<IClient>({
  client_id: { type: String, unique: true },
  client_secret: String,
  redirectUris: [String],
});

export const Client = mongoose.model('clients', clientSchema);