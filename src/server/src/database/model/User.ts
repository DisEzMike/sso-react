import mongoose from "mongoose";

export interface IUser extends Document {
    email: string
    displayName: string;
    pictureUrl: string;
    role: 0 | 1
    created_at: Date;
    updated_at: Date;
}

export const userSchema = new mongoose.Schema<IUser>({
    email: String,
    displayName: String,
    pictureUrl: String,
    role: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});
  
export const User = mongoose.model<IUser>("users", userSchema);