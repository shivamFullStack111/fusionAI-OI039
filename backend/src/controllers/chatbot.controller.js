import { Chatbot } from "../schemas/chatbot.schema.js";
import { Conversation } from "../schemas/conversation.schema.js";
import { Message } from "../schemas/message.schema.js";
import { Section } from "../schemas/section.schema.js";
import { Subscription } from "../schemas/subscription.schema.js";
import { User } from "../schemas/user.schema.js";
import { isSubscribed_function } from "../utils/functions.js";

export const getUserChatbot = async (req, res) => {
  try {
    const chatbot = await Chatbot.findOne({ userId: req.user?._id });

    if (!chatbot)
      return res.send({ success: false, message: "User chatbot not found" });

    return res.send({ success: true, message: "Chatbot found", chatbot });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};
export const getChatbotAndRequiredData = async (req, res, next) => {
  try {
    if (!req.body?.chatbotId) {
      return res.send({ success: false, message: "chatbot id is required" });
    }

    const chatbot = await Chatbot.findOne({ _id: req.body?.chatbotId });

    if (!chatbot)
      return res.send({ success: false, message: " chatbot not found" });

    const user = await User.findOne({ _id: chatbot?.userId }).select(
      "-password",
    );

    if (!user) return res.send({ success: false, message: " user not found" });

    // Using Middleware
    req.user = user; // for middleware
    const userCurrentPlan = await isSubscribed_function(req, res, user?._id);

    const sections = await Section.find({
      isActive: true,
      userId: user?._id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "knowledgeSourceIds",
        match: { isActive: true },
      });

    if (!sections?.length)
      return res.send({ success: false, message: " sections not found" });

    // ============================================================================
    // ------------ FINDING CONVERSATION IF NOT EXIST CREATE NEW ------------------
    // ============================================================================
    const external_userId = req?.body?.external_userId || "";
    const userIP = req.ip || "";

    const idToFind = external_userId || userIP;

    let conversation = null;

    conversation = await Conversation.findOne({
      externaluserId: idToFind,
      chatbotId: req?.body?.chatbotId,
    });

    let allMessages = [];

    allMessages.push({
      role: "ai",
      content: chatbot?.welcomeMessage,
    });

    if (conversation) {
      const messages = await Message.find({
        conversationId: conversation?._id,
      });
      allMessages = [...allMessages, ...messages];
    }

    if (!conversation) {
      console.log("first");
      conversation = new Conversation({
        externaluserId: external_userId || userIP,
        chatbotId: req?.body?.chatbotId,
      });

      await conversation.save();
    }

    return res.send({
      success: true,
      message: "Chatbot found",
      chatbot,
      sections,
      user,
      conversation,
      allMessages,
      userCurrentPlan,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const updateChatbot = async (req, res) => {
  try {
    if (!req?.body?.chatbotId)
      return res.send({ success: false, message: "Chatbot id is required" });

    let dataToUpdate = {};

    if (req.body?.primaryColor)
      dataToUpdate.primaryColor = req.body?.primaryColor;

    if (req.body?.welcomeMessage)
      dataToUpdate.welcomeMessage = req.body?.welcomeMessage;

    const chatbot = await Chatbot.findOneAndUpdate(
      { userId: req?.user?._id, _id: req?.body?.chatbotId },
      { $set: dataToUpdate },
      { returnDocument: "after" },
    );

    return res.send({
      success: true,
      message: "chatbot updated",
      chatbot: chatbot,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};
