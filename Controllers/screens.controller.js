import { screensModel } from '../Models/screens.model.js';
import customError from '../Utils/errorHandler.js';

export const addScreenController = async (request, response, next) => {
    const { name, showId, totalSeats, layout } = request.body;
    if (!name || !totalSeats || !layout) {
        throw new customError('All fields are required', 400);
    }
    const newScreen = await screensModel.create({ name, showId, totalSeats, layout });
    response.status(201).json({ success: true, message: 'Screen added successfully', screen: newScreen });
};

export const getAllScreenController = async (request, response, next) => {
    const screens = await screensModel.find().populate('showId');
    response.status(200).json({ success: true, screens });
};

