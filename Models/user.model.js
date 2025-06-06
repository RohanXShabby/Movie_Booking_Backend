import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    emailToken: {
        type: String,
        default: null
    },
    otp: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'blocked', 'pending'],
        default: 'pending'
    }
}, { timestamps: true });

export const User = mongoose.model('users', userSchema);