import { Router } from 'express'
import { asyncHandler } from '../Utils/asyncHandler.js'
import { authCheck } from '../Middleware/auth.middleware.js'
import {
    addShowController,
    getShowController,
    updateShowController,
    deleteShowController,
    getShowByIdController,
    getShowsByTheaterController,
    getShowsByMovieController
} from '../Controllers/shows.controller.js'

export const showRoutes = Router()

// Public routes
showRoutes.get('/shows', asyncHandler(getShowController))
showRoutes.get('/shows/:id', asyncHandler(getShowByIdController))
showRoutes.get('/shows/theater/:theaterId', asyncHandler(getShowsByTheaterController))
showRoutes.get('/shows/movie/:movieId', asyncHandler(getShowsByMovieController))

// Admin only routes
showRoutes.post('/shows', authCheck, asyncHandler(addShowController))
showRoutes.put('/shows/:id', authCheck, asyncHandler(updateShowController))
showRoutes.delete('/shows/:id', authCheck, asyncHandler(deleteShowController))