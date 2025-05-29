import { Router } from 'express'
import { asyncHandler } from '../Utils/asyncHandler.js'
import { addShowController, getShowController } from '../Controllers/shows.controller.js'

export const showRoutes = Router()


showRoutes.post('/add-show', asyncHandler(addShowController))

showRoutes.get('/get-show', asyncHandler(getShowController))