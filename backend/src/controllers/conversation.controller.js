import { Chatbot } from "../schemas/chatbot.schema.js";
import { Conversation } from "../schemas/conversation.schema.js";

export const getAllConversations = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOne({ userId: req?.user?._id });
    console.log(chatbot);
    if (!chatbot) {
      return res.send({ success: false, message: "Chatbot not found" });
    }
    const conversations = await Conversation.find({
      chatbotId: chatbot?._id,
    }).sort({ updatedAt: -1 });
    return res.send({
      success: true,
      allConversations: conversations,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const getExternalUserAllConversations = async (req, res) => {
  try {
    const { chatbotId, externalUserId } = req.body;
    if (!chatbotId) {
      return res.send({ success: false, message: "Chatbot ID is required" });
    }

    const userIp = req.ip || "";

    const conversations = await Conversation.find({
      chatbotId,
      externaluserId: externalUserId || userIp,
    }).sort({ updatedAt: -1 });
    return res.send({
      success: true,
      allConversations: conversations,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { conversationId } = req.body;
    const { ratings, message } = req.body;
    if (!conversationId) {
      return res.send({
        success: false,
        message: "Conversation ID is required",
      });
    }
    if (!ratings || ratings < 1 || ratings > 5) {
      return res.send({
        success: false,
        message: "Ratings must be a number between 1 and 5",
      });
    }
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.send({
        success: false,
        message: "Conversation not found",
      });
    }
    conversation.review = {
      ratings,
      message,
    };
    await conversation.save();
    return res.send({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};
