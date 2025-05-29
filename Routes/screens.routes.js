import { Router } from 'express'
import { asyncHandler } from '../Utils/asyncHandler.js'
import { addScreenController, getAllScreenController } from '../Controllers/screens.controller.js'

export const screenRoutes = Router()



screenRoutes.post('/add-screen', asyncHandler(addScreenController))

screenRoutes.post('/get-screen', asyncHandler(getAllScreenController))