import { Router } from 'express'
import { addMovieController, addPosterController, deleteMovieController, updateMovieController, getAllMoviesController } from '../Controllers/admin.controller.js'
import { asyncHandler } from '../Utils/asyncHandler.js'
import multer from 'multer'
import { storage } from '../Service/cloudnary.service.js'
import { authCheck } from '../Middleware/auth.middleware.js'

export const adminRouter = Router()

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

adminRouter.post('/add-movie', asyncHandler(addMovieController))
adminRouter.post('/add-poster', upload.single('image'), asyncHandler(addPosterController))
adminRouter.get('/movies', asyncHandler(getAllMoviesController))
adminRouter.delete('/movies/:id', authCheck, asyncHandler(deleteMovieController))
adminRouter.put('/movies/:id', authCheck, asyncHandler(updateMovieController))