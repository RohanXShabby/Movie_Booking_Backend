import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movies",
        required: true
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "screens",
        required: true
    },
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "theaters",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    format: {
        type: String
    },
    seatPrice: [{
        seatType: { type: String, required: true },
        price: { type: Number, required: true }
    }]
}, { timestamps: true });


export const showModel = mongoose.model('shows', showSchema);