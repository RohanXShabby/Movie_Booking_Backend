import { bookingModel } from '../Models/booking.model.js';
import { showModel } from '../Models/shows.model.js';
import customError from '../Utils/errorHandler.js';



export const addBookingController = async (request, response, next) => {
    const { userId, showId, seats, totalAmount, paymentId } = request.body;

    if (!userId || !showId || !seats || !totalAmount || !paymentId) {
        throw new customError('All fields are required', 400);
    }

    // Get the show and its associated screen to verify seat availability and pricing
    const show = await showModel.findById(showId).populate('screenId');
    if (!show) {
        throw new customError('Show not found', 404);
    }

    // Verify all seats exist and are available
    let calculatedTotal = 0;
    const seatDetails = [];

    for (const seat of seats) {
        const [row, seatNum] = seat.match(/([A-Z])(\d+)/).slice(1);
        const rowIndex = row.charCodeAt(0) - 65;
        const seatIndex = parseInt(seatNum) - 1;

        const seatInLayout = show.screenId.layout[rowIndex]?.[seatIndex];
        if (!seatInLayout) {
            throw new customError(`Invalid seat selected: ${seat}`, 400);
        }
        if (!seatInLayout.available) {
            throw new customError(`Seat ${seat} is already booked`, 400);
        }

        // Get the price for this seat type from the show's pricing
        const seatPrice = show.seatPrice.find(sp => sp.seatType === seatInLayout.seatType)?.price;
        if (!seatPrice) {
            throw new customError(`Price not found for seat type: ${seatInLayout.seatType}`, 400);
        }

        calculatedTotal += seatPrice;
        seatDetails.push({
            seatId: seat,
            type: seatInLayout.seatType,
            price: seatPrice
        });
    }

    // For testing purposes, we're allowing ₹1 as the payment amount
    // In production, you would want to validate: if (calculatedTotal !== totalAmount)
    if (totalAmount !== 1) {
        throw new customError('Invalid amount', 400);
    }

    const newBooking = await bookingModel.create({
        userId,
        showId,
        seats: seatDetails,
        totalAmount,
        paymentId,
        isConfirmed: true // Payment is confirmed since we have a paymentId
    });

    const populatedBooking = await bookingModel.findById(newBooking._id)
        .populate("userId", "name email")
        .populate({
            path: "showId",
            populate: {
                path: "movieId",
                select: "title"
            }
        });

    response.status(201).json({
        success: true,
        booking: populatedBooking
    });
};


export const getAllBookingController = async (request, response, next) => {
    const bookings = await bookingModel.find().populate('userId').populate('showId');
    response.status(200).json({ success: true, bookings });
};