import { Plan } from "../schemas/plan.schema.js";

export const createPlan = async (req, res) => {
  try {
    if (!req.user?.isAdmin)
      return res.send({
        success: false,
        message: "Only admin can access this api",
      });

    const {
      planType,
      price,
      conversationHistory,
      customizePromt,
      totalTeamMembers,
      totalKnowledges,
      totalMessages,
      prioritySupport,
      showBranding,
    } = req.body;


    if (
      planType === undefined ||
      price === undefined ||
      showBranding === undefined ||
      conversationHistory === undefined ||
      customizePromt === undefined ||
      totalTeamMembers === undefined ||
      totalKnowledges === undefined ||
      totalMessages === undefined ||
      prioritySupport === undefined
    ) {
      return res.send({ success: false, message: "All filds are required" });
    }

    if (!["free", "popular", "bussiness"].includes(planType)) {
      return res.send({
        success: false,
        message: "plan type must be free, popular or bussiness",
      });
    }

    const plan = await Plan.findOne({ planType });

    if (plan)
      return res.send({
        success: false,
        message: `Plan with "${planType}" type is already exist`,
      });

    const newPlan = new Plan({
      planType,
      price,
      conversationHistory,
      customizePromt,
      totalTeamMembers,
      totalKnowledges,
      totalMessages,
      prioritySupport,
      showBranding,
    });

    await newPlan.save();

    return res.send({
      success: true,
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const getAllPlan = async (req, res) => {
  try {
    const allPlan = await Plan.find().sort({ createdAt: -1 });

    return res.send({ success: true, message: "all Plan get", allPlan });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};
