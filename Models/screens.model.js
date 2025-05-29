import mongoose from "mongoose";


const screensSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    totalSeats: {
        type: Number,
        required: true
    },
    layout: {
        type: [[{
            seatNumber: String,
            seatType: String,
            available: { type: Boolean, default: true }
        }]],
        required: true
    }
}, { timestamps: true });


export const screensModel = mongoose.model('screens', screensSchema);