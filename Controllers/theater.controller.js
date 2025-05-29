import { theaterModel } from '../Models/theater.model.js';
import customError from '../Utils/errorHandler.js';
import { showModel } from '../Models/shows.model.js'

export const addTheaterController = async (request, response, next) => {
    const { name, city, address, screens } = request.body;
    if (!name || !city || !address || !screens) {
        throw new customError('All fields are required', 400);
    }
    const newTheater = await theaterModel.create({ name, city, address, screens });
    response.status(201).json({ success: true, message: 'Theater added successfully', theater: newTheater });
};


export const getTheatersByMovieId = async (req, res, next) => {
    const { movieId } = req.params;

    const theaters = await showModel
        .find({ movieId })
        .populate('theaterId')
        .populate('screenId')
        .populate('movieId');

    // const uniqueTheatersMap = new Map();

    // shows.forEach(show => {
    //     const theater = show.theaterId;
    //     if (theater && !uniqueTheatersMap.has(theater._id.toString())) {
    //         uniqueTheatersMap.set(theater._id.toString(), theater);
    //     }
    // });

    // const uniqueTheaters = Array.from(uniqueTheatersMap.values());

    res.status(200).json({
        success: true,
        theaters
    });

};
