import { Router } from 'express'
import {
    addMovieController,
    addPosterController,
    deleteMovieController,
    updateMovieController,
    getAllMoviesController,
    getAllUsersController,
    updateUserStatusController,
    deleteUserController
} from '../Controllers/admin.controller.js'
import { asyncHandler } from '../Utils/asyncHandler.js'
import multer from 'multer'
import { storage } from '../Service/cloudnary.service.js'
import { authCheck } from '../Middleware/auth.middleware.js'

export const adminRouter = Router()

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

// Movie routes
adminRouter.post('/add-movie', asyncHandler(addMovieController))
adminRouter.post('/add-poster', upload.single('image'), asyncHandler(addPosterController))
adminRouter.get('/movies', asyncHandler(getAllMoviesController))
adminRouter.delete('/movies/:id', authCheck, asyncHandler(deleteMovieController))
adminRouter.put('/movies/:id', authCheck, asyncHandler(updateMovieController))

// User management routes
adminRouter.get('/users', authCheck, asyncHandler(getAllUsersController))
adminRouter.put('/users/:id/status', authCheck, asyncHandler(updateUserStatusController))
adminRouter.delete('/users/:id', authCheck, asyncHandler(deleteUserController))