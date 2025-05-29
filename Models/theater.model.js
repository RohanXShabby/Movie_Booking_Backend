import mongoose from "mongoose";


const theaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    screens: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "screens",
        required: true
    }
}, { timestamps: true });

export const theaterModel = mongoose.model('theaters', theaterSchema);