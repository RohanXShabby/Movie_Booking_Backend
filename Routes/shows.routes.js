import { Router } from 'express'
import { asyncHandler } from '../Utils/asyncHandler.js'
import { addShowController, getShowController } from '../Controllers/shows.controller.js'

export const showRoutes = Router()


showRoutes.post('/shows', asyncHandler(addShowController))
showRoutes.get('/shows', asyncHandler(getShowController))
showRoutes.put('/shows/:id', asyncHandler(updateShowController))
showRoutes.delete('/shows/:id', asyncHandler(deleteShowController))
showRoutes.get('/shows/:id', asyncHandler(getShowByIdController))
showRoutes.get('/shows/theater/:theaterId', asyncHandler(getShowsByTheaterController))
showRoutes.get('/shows/movie/:movieId', asyncHandler(getShowsByMovieController))