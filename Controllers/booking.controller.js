import { bookingModel } from '../Models/booking.model.js';
import customError from '../Utils/errorHandler.js';



export const addBookingController = async (request, response, next) => {
    const { userId, showId, seats, totalAmount, isConfirmed } = request.body;

    if (!userId || !showId || !seats || !totalAmount) {
        throw new customError('All fields are required', 400);
    }
    const newBooking = await bookingModel.create({
        userId,
        showId,
        seats,
        totalAmount,
        isConfirmed
    });
    const populatedBooking = await bookingModel.findById(newBooking._id)
        .populate("userId", "name email")
        .populate({
            path: "showId",
            populate: [
                { path: "movieId", select: "title genre duration" },
                { path: "theaterId", select: "name city address" },
                { path: "screenId", select: "name totalSeats" }
            ]
        });
    response.status(201).json({
        success: true,
        message: 'Booking added successfully',
        booking: populatedBooking
    });
};


export const getAllBookingController = async (request, response, next) => {
    const bookings = await bookingModel.find().populate('userId').populate('showId');
    response.status(200).json({ success: true, bookings });
};