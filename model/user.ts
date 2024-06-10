import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
    first_name: string | null;
    last_name: string | null;
    email: string;
    password: string;
    token?: string;
}

const userSchema: Schema<IUser> = new Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String }
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
