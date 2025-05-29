import { Router } from 'express'
import { addMovieController, addPosterController } from '../Controllers/admin.controller.js'
import { asyncHandler } from '../Utils/asyncHandler.js'
import multer from 'multer'
import { storage } from '../Service/cloudnary.service.js'

export const adminRouter = Router()

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })


adminRouter.post('/add-movie', asyncHandler(addMovieController))

adminRouter.post('/add-poster', upload.single('image'), asyncHandler(addPosterController))