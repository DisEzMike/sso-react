import mongoose from "mongoose";
import { User } from './User.ts';
import { googleProfile } from '../../utils/type.ts';

export interface IProviderUser extends Document {
    userId: string,
    type: string,
    data: googleProfile
}

export const providerUserSchema = new mongoose.Schema<IProviderUser>({
    userId: String,
    type: String,
    data: Object
}, {timestamps: true});

providerUserSchema.pre("save", async function (next){
    if (this.isNew) {
        try {
            if (this.type == "google") {
                const user = await User.findOneAndUpdate({email: this.data.email});
                if (user) {
                    this.userId = user.id;
                } else {
                    const new_user = new User({
                        displayName: this.data.name,
                        email: this.data.email,
                        pictureUrl: this.data.picture
                    });
                    await new_user.save();
                    this.userId = new_user.id;
                }
                next();
            }
        } catch (err) {
            next(err as any);
        }
    } else {
        next();
    }
})
  
export const ProviderUser = mongoose.model<IProviderUser>("provider_users", providerUserSchema);