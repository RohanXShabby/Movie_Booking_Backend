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

export const updateTheaterController = async (request, response, next) => {
    try {
        const { id } = request.params;
        const { name, city, address } = request.body;

        // Validate input
        const errors = {};
        if (!name || !name.trim()) errors.name = 'Theater name is required';
        if (!city || !city.trim()) errors.city = 'City is required';
        if (!address || !address.trim()) errors.address = 'Address is required';

        if (Object.keys(errors).length > 0) {
            throw new customError('Validation failed', 400, errors);
        }

        const theater = await theaterModel.findById(id);
        if (!theater) {
            throw new customError('Theater not found', 404);
        }

        // Update and trim values
        theater.name = name.trim();
        theater.city = city.trim();
        theater.address = address.trim();

        await theater.save();

        response.status(200).json({
            success: true,
            message: 'Theater updated successfully',
            theater
        });
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            next(new customError('Invalid theater ID', 400));
        } else {
            next(error);
        }
    }
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
