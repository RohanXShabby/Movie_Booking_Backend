import { movieModel } from '../Models/movie.model.js'
import { User } from '../Models/user.model.js'

export const addMovieController = async (request, response, next) => {
    const movieDetails = request.body;

    const requiredFields = [
        "title", "genre", "language", "duration", "releaseDate",
        "rating", "cast", "director", "posterUrl", "trailerUrl", "description"
    ];
    const missingFields = requiredFields.filter(field => !movieDetails[field]);
    if (missingFields.length > 0) {
        return response.status(400).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`
        });
    }
    const newMovie = new movieModel(movieDetails);
    await newMovie.save();
    response.status(201).json({
        success: true,
        message: 'Movie Added Successfully',
        movie: newMovie
    });
}

export const addPosterController = async (request, response, next) => {
    try {
        if (!request.file || !request.file.path) {
            return response.status(400).json({ success: false, message: "Can't get Image" });
        }
        const { path: imageUrl, filename } = request.file;

        return response.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            url: imageUrl, // Changed from secure_url to url to match what frontend expects
            filename,
        });
    } catch (error) {
        console.error("Upload error:", error);
        next(error);
    }
};

export const deleteMovieController = async (request, response, next) => {
    const { id } = request.params;
    const movie = await movieModel.findByIdAndDelete(id);
    if (!movie) {
        return response.status(404).json({
            success: false,
            message: 'Movie not found'
        });
    }
    response.status(200).json({
        success: true,
        message: 'Movie deleted successfully'
    });
};

export const updateMovieController = async (request, response, next) => {
    const { id } = request.params;
    const updates = request.body;

    const movie = await movieModel.findByIdAndUpdate(id, updates, { new: true });
    if (!movie) {
        return response.status(404).json({
            success: false,
            message: 'Movie not found'
        });
    }
    response.status(200).json({
        success: true,
        message: 'Movie updated successfully',
        movie
    });
};

export const getAllMoviesController = async (request, response, next) => {
    const movies = await movieModel.find({}).sort({ createdAt: -1 });
    response.status(200).json({
        success: true,
        movies
    });
};

export const getAllUsersController = async (request, response) => {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    response.status(200).json({
        success: true,
        users
    });
};

export const updateUserStatusController = async (request, response) => {
    const { id } = request.params;
    const { status, isAdmin } = request.body;

    const updateFields = {
        status,
        ...(isAdmin !== undefined && { isAdmin })
    };

    const user = await User.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, select: '-password' }
    );

    if (!user) {
        return response.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    response.status(200).json({
        success: true,
        message: 'User status updated successfully',
        user
    });
};

export const deleteUserController = async (request, response) => {
    const { id } = request.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return response.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    response.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
};
