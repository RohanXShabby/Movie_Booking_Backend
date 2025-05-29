import { Router } from 'express'
import { asyncHandler } from '../Utils/asyncHandler.js'
import { addTheaterController, getTheatersByMovieId } from '../Controllers/theater.controller.js'

export const theaterRoutes = Router()



theaterRoutes.post('/add-theater', asyncHandler(addTheaterController))

theaterRoutes.get('/get-theater/:movieId', asyncHandler(getTheatersByMovieId))