import { User } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import emailSender from "../Service/mailer.service.js";
import customError from "../Utils/errorHandler.js";
import { emailVerification } from "../Templates/mailTemplates.js";
import { randomBytes } from "crypto";
import { optTemplate } from "../Templates/otpTemplates.js";
import env from "dotenv";
import jwt from 'jsonwebtoken'
import { movieModel } from '../Models/movie.model.js'
import { bookingModel } from '../Models/booking.model.js'

env.config();

export const initialController = async (request, response, next) => {
    const { email } = request.user
    const user = await User.findOne({ email });

    if (!user) {
        throw new customError("User not found", 404);
    }
    const { password: _, ...userWithoutPassword } = user._doc;

    response.status(200).send({ message: "User Authorized", userDetails: userWithoutPassword });
};

export const registerController = async (request, response, next) => {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
        throw new customError("All Feilds Required", 400);
    }
    const token = randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 5);
    const lowerCaseEmail = email.trim().toLowerCase();
    const userDetail = new User({
        name,
        email: lowerCaseEmail,
        password: hashedPassword,
        emailToken: token,
    });

    await userDetail.save();

    const subject = "Sign Up Confirmation";
    const content = emailVerification()
        .replace("userName", name)
        .replace(
            "VerifyUrl",
            `${process.env.FRONTEND_URL}/api/verify/${userDetail._id}/${token}`,
        );

    emailSender(email, subject, content);
    response.status(201).json({ success: true, data: userDetail });
};

export const verifyEmailController = async (request, response) => {
    const { ID, token } = request.params;
    const user = await User.findById(ID);

    if (!user) {
        throw new customError("User not found", 404);
    }
    if (user.emailToken !== token) {
        throw new customError("Invalid Token", 400);
    }
    user.isVerified = true;
    user.emailToken = undefined;
    await user.save();

    response.status(200).redirect("https://movie-booking-frontend-two.vercel.app/verifiedstatus");
};

export const userLoginController = async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        throw new customError("Please fill all the fields", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new customError("User not found", 404);
    }

    if (!user.isVerified) {
        throw new customError("Please verify your email before login", 400);
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
        throw new customError("Wrong password, try again", 400);
    }

    const data = { id: user._id, name: user.name, email: user.email };

    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "10d" });

    response.set('Access-Control-Expose-Headers', 'Authorization');
    response.set('Authorization', `Bearer ${token}`);

    const { password: _, ...userWithoutPassword } = user._doc;

    response.status(200).json({
        message: "User logged in successfully",
        token,
        user: userWithoutPassword,
    });
};

export const otpController = async (request, response) => {
    const { email } = request.body;
    const userDetails = await User.findOne({ email });

    if (!userDetails) {
        throw new customError("User not found", 404);
    }
    const OTP = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    userDetails.otp = OTP;

    await userDetails.save();

    const subject = "Password Reset OTP";
    const content = optTemplate(OTP);

    emailSender(email, subject, content);
    response.status(200).json("OTP Sent successfully");
};


export const verifyOtpController = async (request, response) => {
    const { email, otp } = await request.body;
    const userDetails = await User.findOne({ email });

    if (!userDetails) {
        throw new customError("User not found", 404);
    }
    if (userDetails.otp !== otp) {
        throw new customError('Invalid OTP', 400)
    }
    userDetails.otp = undefined
    await userDetails.save();

    response.status(200).json("OTP verify successfully").redirect(`${process.env.FRONTEND_URL}/password-reset`)
};

export const passwordResetController = async (request, response) => {
    const { email, newPassword } = request.body;
    const userDetails = await User.findOne({ email });

    if (!userDetails) {
        throw new customError("User not found", 404);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 16)

    userDetails.password = hashedPassword
    await userDetails.save();

    response.status(200).json({ message: "Password Changed successfully" });
};

export const getAllMovieController = async (request, response, next) => {
    const movies = await movieModel.find().sort({ createdAt: -1 })
    if (!movies) {
        throw new customError('Can,t Get Movies', 404)
    }
    response.status(200).json({ message: "Movie fetched Successfully", movies })
}

export const getSingleMovieController = async (request, response) => {
    const { id } = request.params
    const movieDetails = await movieModel.findById(id);
    if (!movieDetails) {
        throw new customError('Movie not found', 404);
    }

    response.status(200).json({ message: "success", data: movieDetails })

}

export const getUserBookings = async (request, response, next) => {
    const userId = request.user._id;

    const bookings = await bookingModel.find({ userId })
        .populate({
            path: 'showId',
            populate: [
                { path: 'movieId', select: 'title' },
                { path: 'screenId', select: 'name' },
                { path: 'theaterId', select: 'name' }
            ]
        })
        .sort({ createdAt: -1 }); // Most recent bookings first

    const formattedBookings = bookings.map(booking => ({
        id: booking._id,
        movieName: booking.showId.movieId.title,
        theaterName: booking.showId.theaterId.name,
        screenName: booking.showId.screenId.name,
        date: booking.showId.date,
        time: booking.showId.time,
        seats: booking.seats,
        total: booking.totalAmount,
        isConfirmed: booking.isConfirmed,
        createdAt: booking.createdAt
    }));

    response.status(200).json({
        success: true,
        bookings: formattedBookings,
        totalBookings: bookings.length
    });
};