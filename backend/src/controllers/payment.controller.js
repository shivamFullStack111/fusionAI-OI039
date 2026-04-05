import { razorpay } from "../config/razorpayConfig.js";
import crypto from "crypto";
import { Plan } from "../schemas/plan.schema.js";
import { v4 as uuidv4 } from "uuid";
import { Subscription } from "../schemas/subscription.schema.js";
import { Chatbot } from "../schemas/chatbot.schema.js";

export const createOrder = async (req, res) => {
  try {
    const plan = await Plan.findOne({ planType: req.body?.planType });

    if (!plan)
      return res.send({ success: false, message: "This plan doesn't exist" });

    // getting and checking if user purchased this or greater plan
    // if user purchased this or greater plan and their plan is not expired then create new subscription
    const userLatestPlan = await Subscription.findOne({
      userId: req.body.userId,
    })
      .sort({ createdAt: -1 })
      .populate("planId");

    if (userLatestPlan) {
      const isPlanEnded = new Date() > new Date(userLatestPlan.endDate);

      const plansTypes = ["free", "popular", "bussiness"];

      // this plan
      if (
        !isPlanEnded &&
        plansTypes.indexOf(userLatestPlan.planId.planType) ==
          plansTypes.indexOf(req.body.planType)
      ) {
        return res.send({
          success: false,
          message: "You already have this plan ",
        });
      }

      // greater plan
      if (
        !isPlanEnded &&
        plansTypes.indexOf(userLatestPlan?.planId.planType) >
          plansTypes.indexOf(req.body.planType)
      ) {
        return res.send({
          success: false,
          message: "You already have grater plan ",
        });
      }
    }

    const options = {
      amount: plan?.price * 100,
      currency: "INR",
      receipt: uuidv4(),
      payment_capture: 1,
    };

    const response = await razorpay.orders.create(options);

    return res.send({
      success: true,
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: err?.message || err?.error?.description,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .send({ success: false, message: "Payment failed" });
    }

    const endDate = new Date(Date.now());
    endDate.setMonth(endDate.getMonth() + 1);

    const newSubscription = new Subscription({
      userId: req.body?.userId,
      planId: planId,
      startDate: new Date(Date.now()),
      endDate: new Date(endDate),
      paymentId: razorpay_payment_id,
    });

    const isChatbotExist = await Chatbot.findOne({ userId: req.body?.userId });

    let newChatbot;
    if (!isChatbotExist) {
      newChatbot = new Chatbot({
        userId: req.body?.userId,
        planId: planId,
      });
      await newChatbot.save();
    } else {
      isChatbotExist.planId = planId;
      await isChatbotExist.save();
    }

    await newSubscription.save();

    return res.send({
      success: true,
      message: "Payment successful",
      subsciption: newSubscription,
      chatbot: newChatbot || isChatbotExist,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

export const purchaseFreepPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ planType: req.body?.planType });

    if (!plan)
      return res.send({ success: false, message: "This plan doesn't exist" });

    // getting and checking if user purchased this or greater plan
    // if user purchased this or greater plan and their plan is not expired then create new subscription
    const userLatestPlan = await Subscription.findOne({
      userId: req.body.userId,
    })
      .sort({ createdAt: -1 })
      .populate("planId");

    if (userLatestPlan) {
      const isPlanEnded = new Date() > new Date(userLatestPlan.endDate);

      const plansTypes = ["free", "popular", "bussiness"];

      // this plan
      if (
        !isPlanEnded &&
        plansTypes.indexOf(userLatestPlan.planId.planType) ==
          plansTypes.indexOf(req.body.planType)
      ) {
        return res.send({
          success: false,
          message: "You already have this plan ",
        });
      }

      // greater plan
      if (
        !isPlanEnded &&
        plansTypes.indexOf(userLatestPlan?.planId.planType) >
          plansTypes.indexOf(req.body.planType)
      ) {
        return res.send({
          success: false,
          message: "You already have grater plan ",
        });
      }
    }

    const endDate = new Date(Date.now());
    endDate.setMonth(endDate.getMonth() + 1);

    const newSubscription = new Subscription({
      userId: req.body?.userId,
      planId: plan?._id,
      startDate: new Date(Date.now()),
      endDate: new Date(endDate),
      paymentId: "free",
    });

    const isChatbotExist = await Chatbot.findOne({ userId: req.body?.userId });

    let newChatbot;
    if (!isChatbotExist) {
      newChatbot = new Chatbot({
        userId: req.body?.userId,
        planId: planId,
      });
      await newChatbot.save();
    }

    await newSubscription.save();

    return res.send({
      success: true,
      message: "Payment successful",
      subsciption: newSubscription,
      chatbot: newChatbot || isChatbotExist,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
