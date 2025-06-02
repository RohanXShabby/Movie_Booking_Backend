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

export const getScreenByIdController = async (request, response, next) => {
    const { id } = request.params;

    if (!id) {
        throw new customError('Screen ID is required', 400);
    }

    const screen = await screensModel.findById(id).populate('showId');

    if (!screen) {
        throw new customError('Screen not found', 404);
    }

    response.status(200).json({ success: true, screen });
};

