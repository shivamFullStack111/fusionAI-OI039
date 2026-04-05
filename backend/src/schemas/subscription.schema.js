import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      immutable: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plan",
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paymentId: {
      type: String, // Razorpay/Stripe ka transaction id
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("subscription", subscriptionSchema);
