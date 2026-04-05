import { Subscription } from "../schemas/subscription.schema.js";

export const isSubscribed = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const userCurrentPlan = await Subscription.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("planId");

    if (!userCurrentPlan)
      return res.send({ success: false, message: "You have to purchase plan" });

    const endDate = new Date(userCurrentPlan.endDate);
    const today = new Date(Date.now());

    const isExpired = today > endDate;

    if (isExpired)
      return res.send({
        success: false,
        message: "Your current plan is expired",
      });

    req.userCurrentPlan = userCurrentPlan;
    next();
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};
