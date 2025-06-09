import Razorpay from 'razorpay';
import { asyncHandler } from '../Utils/asyncHandler.js';
import { createHmac } from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});

const createOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    // For testing purposes, always use 1 rupee
    const options = {
        amount: 100, // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Could not create order"
        });
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify the payment signature    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        res.json({
            success: true,
            message: "Payment verified successfully"
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Invalid payment signature"
        });
    }
});

export {
    createOrder,
    verifyPayment
};
