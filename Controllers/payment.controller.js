import Razorpay from 'razorpay';
import { asyncHandler } from '../Utils/asyncHandler.js';
import { createHmac } from 'crypto';
import customError from '../Utils/errorHandler.js';

// Initialize Razorpay instance only when needed
let razorpay = null;

const initializeRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
        throw new customError('Razorpay credentials are not configured', 500);
    }

    if (!razorpay) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        });
    }
    return razorpay;
};

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { amount } = req.body;
        const rzp = initializeRazorpay();

        // For testing purposes, always use 1 rupee
        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await rzp.orders.create(options);
        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        throw new customError(error.message || "Could not create order", 500);
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            throw new customError('Missing payment verification parameters', 400);
        }

        // Verify the payment signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            res.json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            throw new customError('Invalid payment signature', 400);
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        throw new customError(error.message || 'Payment verification failed', error.status || 500);
    }
});

export {
    createOrder,
    verifyPayment
};
