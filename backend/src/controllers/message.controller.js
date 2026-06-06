import { llm } from "../config/aiConfig.js";
import { Conversation } from "../schemas/conversation.schema.js";
import { Message } from "../schemas/message.schema.js";
import {
  findReleventDataFromVectorDB,
  findSectionsForUserMessage,
  generateAiResponse,
} from "../utils/ai/ai-functions.js";
import {
  generateEmbedingsofMessage,
  isSubscribed_function,
} from "../utils/functions.js";
import { Chatbot } from "../schemas/chatbot.schema.js";
import { getWorkspaceUserId } from "../utils/workspace.js";

export const sendMessage = async (req, res) => {
  try {
    if (!req.body.userId)
      return res.send({ success: false, message: "User id is required" });

    if (!req.body.chatbotId)
      return res.send({ success: false, message: "Chatbot id is required" });

    // user question
    if (!req?.body.message)
      return res.send({
        success: false,
        message: "User message not found",
      });

    // this is purchase plan of user
    const userCurrentPlan = await isSubscribed_function(
      req,
      res,
      req?.body.userId,
    );

    // count message between purchase and expire date of plan
    const messagesLength = await Message.countDocuments({
      conversationId: req?.body?.conversationId,
      createdAt: {
        $gte: new Date(userCurrentPlan?.startDate),
        $lte: new Date(userCurrentPlan?.endDate),
      },
    });

    // if message limit reach return error
    if (messagesLength >= userCurrentPlan?.planId?.totalMessages) {
      return res.send({
        success: false,
        message: "Message Limit reached you have to re-purchase plan ",
      });
    }

    // creating conversation on userFirst message if conversationId not provided in req.body
    let isNewConversation = false;
    let conversation = null;

    if (!req.body.conversationId) {
      const userIP = req.ip || "";

      const idToFind = req?.body?.external_userId || userIP;

      const newConversation = new Conversation({
        chatbotId: req.body.chatbotId,
        externaluserId: idToFind,
      });

      // generate title of conversation from user first message using ai and save title in conversation collection
      const result = await llm.invoke([
        {
          role: "system",
          content:
            "Generate a short title for this conversation in maximum 3 words in plain text without any special characters and without mentioning that it's a title. just give me the title. user message is: ",
        },
        { role: "user", content: req?.body?.message },
      ]);

      newConversation.title = result.content;

      await newConversation.save();
      isNewConversation = true;
      req.body.conversationId = newConversation._id;
      conversation = newConversation;
    } else {
      conversation = await Conversation.findById(req?.body?.conversationId);
    }

    if (!conversation?.isTicketRaised) {
      // ===========================================================================================
      // ------------------------------------IF TOKEN IS NOT RAISED---------------------------------
      // ===========================================================================================

      const last8Message = req?.body?.allMessages?.slice(-8);

      // ask AI to select the most relevant sections for the user question
      let selectedSectionNames = await findSectionsForUserMessage(
        req?.body?.message,
        req?.body?.sections,
        last8Message,
      );

      // filter sections from req.body.sections that AI selected and gather section data
      let selectedSections = [];

      if (selectedSectionNames?.length) {
        selectedSections = req.body?.sections?.filter((s) =>
          selectedSectionNames.includes(s.sectionName),
        );
      }

      if (!selectedSections?.length) {
        selectedSections = req.body?.sections || [];
      }

      let knowledgeIdsAndOtherRequiredInfo = [];
      if (selectedSections?.length)
        knowledgeIdsAndOtherRequiredInfo = selectedSections?.map((section) => {
          return section?.knowledgeSourceIds?.map((k) => {
            return {
              knowledgeId: k?._id?.toString(),
              tone: section?.tone,
              allowedTopics: section?.allowedTopics,
              blockedTopics: section?.blockedTopics,
              sectionName: section?.sectionName,
            };
          });
        });

      if (knowledgeIdsAndOtherRequiredInfo?.length)
        knowledgeIdsAndOtherRequiredInfo =
          knowledgeIdsAndOtherRequiredInfo?.flat();

      // // Generate embeddings of user text
      const messageEmbeddings = await generateEmbedingsofMessage(
        req.body?.message,
      );

      // // Search query in cromaDB with selected sections knowledge IDs
      let releventData = [];
      if (knowledgeIdsAndOtherRequiredInfo?.length)
        releventData = await Promise.all(
          knowledgeIdsAndOtherRequiredInfo.map((k) =>
            findReleventDataFromVectorDB(
              messageEmbeddings,
              k?.knowledgeId,
              k?.tone,
              k?.allowedTopics,
              k?.blockedTopics,
              null,
              k?.sectionName,
            ),
          ),
        );

      const preferredTone = selectedSections?.[0]?.tone || "friendly";
      const content = await generateAiResponse(
        req?.body?.message,
        releventData,
        last8Message,
        preferredTone,
      );

      const newMessageUser = new Message({
        conversationId: req?.body?.conversationId,
        role: "user",
        content: req?.body?.message,
      });

      const newMessageAi = new Message({
        conversationId: req?.body?.conversationId,
        role: "ai",
        content: content,
      });

      if (content == "Conversation Ended") {
        await Conversation.findOneAndUpdate(
          {
            _id: req?.body?.conversationId,
          },
          {
            $set: {
              isEnded: true,
            },
          },
        );
      }
      if (content == "Ticket Raised!") {
        await Conversation.findOneAndUpdate(
          {
            _id: req?.body?.conversationId,
          },
          {
            $set: {
              isTicketRaised: true,
            },
          },
        );
      }

      await newMessageUser.save();
      await newMessageAi.save();

      return res.send({
        success: true,
        message: "Response generated",
        humanMessage: newMessageUser,
        aiMessage: newMessageAi,
        conversation,
        isNewConversation,
      });
    } else {
      // ===========================================================================================
      // --------------------------------IF TOKEN IS RAISED-----------------------------------------
      // ===========================================================================================

      const newMessageUser = new Message({
        conversationId: req?.body?.conversationId,
        role: "user",
        content: req?.body?.message,
      });

      await newMessageUser.save();

      return res.send({
        success: true,
        message: "Response generated",
        humanMessage: newMessageUser,
        conversation,
        isNewConversation,
        conversationWithTicketRaised: true, // this flag is for frontend to know that ticket is raised in this conversation so that it can show appropriate message to user
      });
    }
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const sendMessageBySupport = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.send({
        success: false,
        message: "Conversation id and message are required",
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.send({
        success: false,
        message: "Conversation not found",
      });
    }
    const chatbot = await Chatbot.findOne({
      _id: conversation.chatbotId,
      userId: getWorkspaceUserId(req.user),
    });

    if (!chatbot) {
      return res.status(403).send({
        success: false,
        message: "You cannot respond to this conversation",
      });
    }

    if (!conversation?.isTicketRaised) {
      return res.send({
        success: false,
        message: "Ticket is not raised for this conversation",
      });
    }

    const newMessageSupport = new Message({
      conversationId,
      role: "support",
      content: message,
    });
    await newMessageSupport.save();

    return res.send({
      success: true,
      message: "Support message sent",
      supportMessage: newMessageSupport,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const testMessage = async (req, res) => {
  try {
    const { message, allMessages } = req.body;

    if (!message) {
      return res.send({
        success: false,
        message: "User message not found",
      });
    }

    // last 5 messages
    const lastMessages =
      allMessages?.slice(-5)?.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.content,
      })) || [];

    const systemPrompt = `
You are a chatbot in TEST MODE.

Rules:
- This is NOT real data
- Do NOT claim accuracy
- Always mention it's a test/demo response
- Keep responses simple and helpful
- If unsure, still answer but mention it's simulated

Add this line at the end:
"(This is a test response, not real data)"
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...lastMessages,
      { role: "user", content: message },
    ];

    const result = await llm.invoke(messages);

    const content = result?.content || "Test response failed (LLM error)";

    return res.send({
      success: true,
      message: "Test response generated",
      aiResponse: content,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

export const getAllMessagesOfConversation = async (req, res) => {
  try {
    const { conversationId } = req.body;
    if (!conversationId)
      return res.send({
        success: false,
        message: "Conversation id is required",
      });

    const messages = await Message.find({
      conversationId,
    }).sort({ createdAt: 1 });

    return res.send({
      success: true,
      messages,
    });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};
