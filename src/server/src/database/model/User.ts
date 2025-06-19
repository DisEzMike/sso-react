import mongoose from "mongoose";

export interface IUser extends Document {
    _id: string;
    username: string;
    password: string;
    email: string;
    displayName: string;
    pictureUrl: string;
    role: 0 | 1
    created_at: Date;
    updated_at: Date;
}

export const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String,
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    displayName: String,
    pictureUrl: String,
    role: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});
  
export const User = mongoose.model<IUser>("users", userSchema);