import { Stripe } from "stripe";
import catchAsyncError from "../middlewares/catchAsyncErrors";

export const createStripePaymentIntent = catchAsyncError(
  async (req, res, next) => {
    const { amount } = req.body;
    const payAmount = Math.round(Number(amount) * 100); // Convert to smallest currency unit (cents)

    // console.log("aaaaaaaaa", amount);
    const stripe = new Stripe(process.env.STRIPE_KEY as string);
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: payAmount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.json({
        data: paymentIntent.client_secret,
        message: "Successfully created payment intent",
        success: true,
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
