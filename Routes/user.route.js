import { Router } from "express";
import { initialController, registerController, verifyEmailController, userLoginController, otpController, passwordResetController, verifyOtpController, getAllMovieController, getSingleMovieController } from "../Controllers/user.controller.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { authCheck } from "../Middleware/auth.middleware.js";



export const router = Router()


router.get('/', authCheck, asyncHandler(initialController))

router.post('/register', asyncHandler(registerController))

router.get('/verify/:ID/:token', asyncHandler(verifyEmailController))

router.post('/userlogin', asyncHandler(userLoginController))

router.post('/otp', asyncHandler(otpController))

router.post('/verify-otp', asyncHandler(verifyOtpController))

router.post('/password-reset', asyncHandler(passwordResetController))

router.post('/userlogin', asyncHandler(userLoginController))

router.get('/get-movies', asyncHandler(getAllMovieController))

router.get('/movies/:id', asyncHandler(getSingleMovieController))