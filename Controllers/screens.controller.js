import { screensModel } from '../Models/screens.model.js';
import { theaterModel } from '../Models/theater.model.js';
import customError from '../Utils/errorHandler.js';

export const addScreenController = async (request, response, next) => {
    const { theaterId } = request.params; const { name, totalSeats, layout, seatPricing } = request.body;

    if (!name || !totalSeats || !layout || !theaterId || !seatPricing) {
        throw new customError('All fields are required', 400);
    }

    // Validate seatPricing structure
    if (!seatPricing.normal || !seatPricing.premium || !seatPricing.recliner ||
        typeof seatPricing.normal !== 'number' ||
        typeof seatPricing.premium !== 'number' ||
        typeof seatPricing.recliner !== 'number') {
        throw new customError('Valid pricing for all seat types (normal, premium, recliner) is required', 400);
    }

    // Validate that all seats in layout have valid types
    for (const row of layout) {
        for (const seat of row) {
            if (!seat.seatType || !['normal', 'premium', 'recliner'].includes(seat.seatType)) {
                throw new customError('Invalid seat type found in layout', 400);
            }
        }
    }

    const theater = await theaterModel.findById(theaterId);
    if (!theater) {
        throw new customError('Theater not found', 404);
    }
    if (!seatPricing || !seatPricing.normal || !seatPricing.premium || !seatPricing.recliner) {
        throw new customError('Seat pricing information is required for all seat types', 400);
    }

    const newScreen = await screensModel.create({
        name,
        totalSeats,
        layout,
        theaterId,
        seatPricing
    });

    // Add screen to theater's screens array
    theater.screens.push(newScreen._id);
    await theater.save();

    response.status(201).json({
        success: true,
        message: 'Screen added successfully',
        screen: newScreen
    });
};

export const getAllScreenController = async (request, response, next) => {
    const screens = await screensModel.find();
    response.status(200).json({ success: true, screens });
};

export const getScreenByIdController = async (request, response, next) => {
    const { id } = request.params;

    if (!id) {
        throw new customError('Screen ID is required', 400);
    }

    const screen = await screensModel.findById(id);

    if (!screen) {
        throw new customError('Screen not found', 404);
    }

    response.status(200).json({ success: true, screen });
};

