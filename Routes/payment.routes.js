import { Router } from 'express';
import { createOrder, verifyPayment } from '../Controllers/payment.controller.js';
import { authCheck } from '../Middleware/auth.middleware.js';

export const paymentRoutes = Router();

paymentRoutes.post('/payment/create-order', authCheck, createOrder);
paymentRoutes.post('/payment/verify', authCheck, verifyPayment);
