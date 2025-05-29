import { Router } from 'express'
import { asyncHandler } from '../Utils/asyncHandler.js'
import { addBookingController, getAllBookingController } from '../Controllers/booking.controller.js'

export const bookingRoutes = Router()

bookingRoutes.post('/book-movie', asyncHandler(addBookingController))

bookingRoutes.post('/getBooking/:userId', asyncHandler(getAllBookingController))