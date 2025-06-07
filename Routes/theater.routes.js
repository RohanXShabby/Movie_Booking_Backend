import { Router } from 'express'
import { asyncHandler } from '../Utils/asyncHandler.js'
import {
    addTheaterController,
    getTheatersByMovieId,
    getAllTheatersController,
    updateTheaterController,
    deleteTheaterController,
    addScreenToTheaterController,
    deleteScreenFromTheaterController
} from '../Controllers/theater.controller.js'
import { authCheck } from '../Middleware/auth.middleware.js'

export const theaterRoutes = Router()

// Theater routes
theaterRoutes.post('/theaters', authCheck, asyncHandler(addTheaterController))
theaterRoutes.get('/theaters', asyncHandler(getAllTheatersController))
theaterRoutes.get('/theaters/movie/:movieId', asyncHandler(getTheatersByMovieId))
theaterRoutes.put('/theaters/:id', authCheck, asyncHandler(updateTheaterController))
theaterRoutes.delete('/theaters/:id', authCheck, asyncHandler(deleteTheaterController))

// Screen routes within theaters
theaterRoutes.post('/theaters/:theaterId/screens', authCheck, asyncHandler(addScreenToTheaterController))
theaterRoutes.delete('/theaters/:theaterId/screens/:screenId', authCheck, asyncHandler(deleteScreenFromTheaterController))