import { showModel } from '../Models/shows.model.js';
import customError from '../Utils/errorHandler.js';

export const addShowController = async (request, response, next) => {
    const { movieId, screenId, theaterId, date, time, format, seatPrice } = request.body; if (!movieId || !screenId || !theaterId || !date || !time || !seatPrice) {
        throw new customError('All fields are required', 400);
    }

    // Check for overlapping shows on the same screen
    const existingShow = await showModel.findOne({
        screenId,
        date,
        time,
        _id: { $ne: request.params.id } // Exclude current show when updating
    });

    if (existingShow) {
        throw new customError('There is already a show scheduled at this time for this screen', 400);
    }

    const newShow = await showModel.create({
        movieId,
        screenId,
        theaterId,
        date,
        time,
        format,
        seatPrice
    });

    const populatedShow = await showModel.findById(newShow._id)
        .populate("movieId", "title genre duration language")
        .populate("theaterId", "name city address")
        .populate("screenId", "name totalSeats");

    response.status(201).json({
        success: true,
        message: 'Show added successfully',
        show: populatedShow
    });
};

export const getShowController = async (request, response, next) => {
    const shows = await showModel.find()
        .populate("movieId", "title genre duration language")
        .populate("theaterId", "name city address")
        .populate("screenId", "name totalSeats")
        .sort({ date: 1, time: 1 });

    response.status(200).json({
        success: true,
        shows
    });
};

export const getShowByIdController = async (request, response, next) => {
    const { id } = request.params;

    const show = await showModel.findById(id)
        .populate("movieId", "title genre duration language")
        .populate("theaterId", "name city address")
        .populate("screenId", "name totalSeats");

    if (!show) {
        throw new customError('Show not found', 404);
    }

    response.status(200).json({
        success: true,
        show
    });
};

export const updateShowController = async (request, response, next) => {
    const { id } = request.params;
    const updates = request.body;

    // Check for overlapping shows if time/date/screen is being updated
    if (updates.date || updates.time || updates.screenId) {
        const existingShow = await showModel.findOne({
            screenId: updates.screenId || updates.screenId,
            date: updates.date || updates.date,
            time: updates.time || updates.time,
            _id: { $ne: id }
        });

        if (existingShow) {
            throw new customError('There is already a show scheduled at this time for this screen', 400);
        }
    }

    const show = await showModel.findByIdAndUpdate(id, updates, { new: true })
        .populate("movieId", "title genre duration language")
        .populate("theaterId", "name city address")
        .populate("screenId", "name totalSeats");

    if (!show) {
        throw new customError('Show not found', 404);
    }

    response.status(200).json({
        success: true,
        message: 'Show updated successfully',
        show
    });
};

export const deleteShowController = async (request, response, next) => {
    const { id } = request.params;

    const show = await showModel.findByIdAndDelete(id);
    if (!show) {
        throw new customError('Show not found', 404);
    }

    response.status(200).json({
        success: true,
        message: 'Show deleted successfully'
    });
};

export const getShowsByTheaterController = async (request, response, next) => {
    const { theaterId } = request.params;

    const shows = await showModel.find({ theaterId })
        .populate("movieId", "title genre duration language")
        .populate("theaterId", "name city address")
        .populate("screenId", "name totalSeats")
        .sort({ date: 1, time: 1 });

    response.status(200).json({
        success: true,
        shows
    });
};

export const getShowsByMovieController = async (request, response, next) => {
    const { movieId } = request.params;

    const shows = await showModel.find({ movieId })
        .populate("movieId", "title genre duration language")
        .populate("theaterId", "name city address")
        .populate("screenId", "name totalSeats")
        .sort({ date: 1, time: 1 });

    response.status(200).json({
        success: true,
        shows
    });
};
