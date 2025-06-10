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
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theaters',
        required: true
    },
    layout: {
        type: [[{
            seatNumber: String,
            seatType: {
                type: String,
                enum: ['normal', 'premium', 'recliner'],
                default: 'normal'
            },
            available: { type: Boolean, default: true }
        }]],
        required: true
    },
    seatPricing: {
        normal: { type: Number, required: true, default: 150 },
        premium: { type: Number, required: true, default: 200 },
        recliner: { type: Number, required: true, default: 300 }
    }
}, { timestamps: true });


export const screensModel = mongoose.model('screens', screensSchema);