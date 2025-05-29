import { showModel } from '../Models/shows.model.js';
import customError from '../Utils/errorHandler.js';

export const addShowController = async (request, response, next) => {
    const { movieId, screenId, theaterId, date, time, format, seatPrice } = request.body;

    if (!movieId || !screenId || !theaterId || !date || !time || !seatPrice) {
        throw new customError('All fields are required', 400);
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

export const getShowController = async (req, res, next) => {
  
};
