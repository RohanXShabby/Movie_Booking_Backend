import { Router } from 'express'
import { asyncHandler } from '../Utils/asyncHandler.js'
import { addScreenController, getAllScreenController, getScreenByIdController } from '../Controllers/screens.controller.js'

export const screenRoutes = Router()

// Create new screen
screenRoutes.post('/add-screen', asyncHandler(addScreenController))

// Get all screens
screenRoutes.get('/screens', asyncHandler(getAllScreenController))

// Get single screen by ID
screenRoutes.get('/screens/:id', asyncHandler(getScreenByIdController))