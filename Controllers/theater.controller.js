import { theaterModel } from '../Models/theater.model.js';
import { screensModel } from '../Models/screens.model.js';
import customError from '../Utils/errorHandler.js';
import { showModel } from '../Models/shows.model.js';

export const addTheaterController = async (request, response, next) => {
    const { name, city, address } = request.body;
    if (!name || !city || !address) {
        throw new customError('All fields are required', 400);
    }
    const newTheater = await theaterModel.create({ name, city, address, screens: [] });
    response.status(201).json({ success: true, message: 'Theater added successfully', theater: newTheater });
};

export const getAllTheatersController = async (request, response) => {
    const theaters = await theaterModel.find()
        .populate({
            path: 'screens',
            select: 'name totalSeats layout'
        })
        .sort({ createdAt: -1 });
    response.status(200).json({
        success: true,
        theaters
    });
};

export const updateTheaterController = async (request, response) => {
    const { id } = request.params;
    const updates = request.body;

    const theater = await theaterModel.findByIdAndUpdate(id, updates, { new: true });
    if (!theater) {
        throw new customError('Theater not found', 404);
    }

    response.status(200).json({
        success: true,
        message: 'Theater updated successfully',
        theater
    });
};

export const deleteTheaterController = async (request, response) => {
    const { id } = request.params;

    const theater = await theaterModel.findById(id);
    if (!theater) {
        throw new customError('Theater not found', 404);
    }

    // Delete all screens associated with the theater
    await screensModel.deleteMany({ _id: { $in: theater.screens } });

    // Delete the theater
    await theater.deleteOne();

    response.status(200).json({
        success: true,
        message: 'Theater and associated screens deleted successfully'
    });
};

export const addScreenToTheaterController = async (request, response) => {
    const { theaterId } = request.params;
    const { name, totalSeats, layout } = request.body;

    const theater = await theaterModel.findById(theaterId);
    if (!theater) {
        throw new customError('Theater not found', 404);
    }

    const newScreen = await screensModel.create({
        name,
        totalSeats,
        layout
    });

    theater.screens.push(newScreen._id);
    await theater.save();

    response.status(201).json({
        success: true,
        message: 'Screen added successfully',
        screen: newScreen
    });
};

export const deleteScreenFromTheaterController = async (request, response) => {
    const { theaterId, screenId } = request.params;

    const theater = await theaterModel.findById(theaterId);
    if (!theater) {
        throw new customError('Theater not found', 404);
    }

    // Remove screen from theater's screens array
    theater.screens = theater.screens.filter(id => id.toString() !== screenId);
    await theater.save();

    // Delete the screen
    await screensModel.findByIdAndDelete(screenId);

    response.status(200).json({
        success: true,
        message: 'Screen deleted successfully'
    });
};

export const getTheatersByMovieId = async (req, res, next) => {
    const { movieId } = req.params;

    const theaters = await showModel
        .find({ movieId })
        .populate('theaterId')
        .populate('screenId')
        .populate('movieId');

    res.status(200).json({
        success: true,
        theaters
    });
};
