import mongoose from "mongoose";

export interface IUser extends Document {
    pictureUrl: string;
    displayName: string;
    role: 0 | 1
    created_at: Date;
    updated_at: Date;
}

export const userSchema = new mongoose.Schema<IUser>({
    displayName: String,
    pictureUrl: String,
    role: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});
  
export const User = mongoose.model<IUser>("users", userSchema);