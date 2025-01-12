import mongoose, {Model} from "mongoose";
import bcrypt from 'bcrypt'
import {User} from "../types";
import {randomUUID} from "node:crypto";

interface UserMethods {
    passwordCheckout(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<User, {}, UserMethods>

const Schema = mongoose.Schema;
const SALT = 8;

const UserSchema = new Schema<User, UserModel, UserMethods>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;

    next();
})

UserSchema.methods.passwordCheckout = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function() {
    this.token = randomUUID();
};

const User = mongoose.model('User', UserSchema);
export default User;