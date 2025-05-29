import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shows",
        required: true,
    },
    seats: {
        type: [String],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    isConfirmed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const bookingModel = mongoose.model('bookings', bookingSchema);