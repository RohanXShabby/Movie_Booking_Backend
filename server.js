import express from 'express'
import { router } from './Routes/user.route.js';
import { adminRouter } from './Routes/admin.routes.js';
import { screenRoutes } from './Routes/screens.routes.js'
import { bookingRoutes } from './Routes/booking.routes.js'
import { showRoutes } from './Routes/shows.routes.js'
import { theaterRoutes } from './Routes/theater.routes.js'
import { paymentRoutes } from './Routes/payment.routes.js'
import env from 'dotenv';
import cors from 'cors'
import DBconnect from './Database/DBconnect.js';
import cookieParser from 'cookie-parser';


env.config()

const server = express();
const PORT = process.env.PORT || 3001;

// cookies middleware
server.use(cookieParser())

//cors Policy
const allowedOrigins = [
    'http://localhost:5173',
    'https://movie-booking-frontend-two.vercel.app'
];

server.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

server.use(express.json());


(async () => {
    try {
        await DBconnect()
        server.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    } catch (error) {
        console.error('Database Connection Error', error.message)
    }
})()

server.get('/', (req, res) => {
    res.send("server Running")
})


server.use('/api', router)
server.use('/api', adminRouter)
server.use('/api', screenRoutes)
server.use('/api', bookingRoutes)
server.use('/api', showRoutes)
server.use('/api', theaterRoutes)
server.use('/api', paymentRoutes)



server.use((error, request, response, next) => {
    response
        .status(error.statusCode || 500)
        .json({ message: error.message || 'Internal Server Error' })
    next()
})
