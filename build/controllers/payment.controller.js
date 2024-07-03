"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripePaymentIntent = void 0;
const stripe_1 = require("stripe");
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
exports.createStripePaymentIntent = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const payAmount = Math.round(Number(amount) * 100); // Convert to smallest currency unit (cents)
    // console.log("aaaaaaaaa", amount);
    const stripe = new stripe_1.Stripe(process.env.STRIPE_KEY);
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: payAmount,
            currency: "usd",
            payment_method_types: ["card"],
        });
        res.json({
            data: paymentIntent.client_secret,
            message: "Successfully created payment intent",
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
