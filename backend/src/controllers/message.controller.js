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

export const sendMessage = async (req, res) => {
  try {
    if (!req.body.userId)
      return res.send({ success: false, message: "User id is required" });
    if (!req.body.conversationId)
      return res.send({
        success: false,
        message: "Conversation id is required",
      });
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

    const last8Message = req?.body?.allMessages?.slice(-8);

    // ask from ai to select sections according user question
    let selectedSectionNames = await findSectionsForUserMessage(
      req?.body?.message,
      req?.body?.sections,
      last8Message,
    );
    console.log("1");

    console.log("2");
    console.log("selectedSectionNames:  ", selectedSectionNames);

    // filter sections from req.body.section that section names provided by ai  and get knowledgeIds from selected sections

    let selectedSections = [];

    if (selectedSectionNames?.length)
      selectedSections = req.body?.sections?.filter((s) =>
        selectedSectionNames.includes(s.sectionName),
      );
    console.log(
      "selectedSections:  ",
      JSON.stringify(selectedSections, null, 2),
    );

    let knowledgeIdsAndOtherRequiredInfo = [];
    if (selectedSections?.length)
      knowledgeIdsAndOtherRequiredInfo = selectedSections?.map((section) => {
        return section?.knowledgeSourceIds?.map((k) => {
          return {
            knowledgeId: k?._id,
            tone: section?.tone,
            allowedTopics: section?.allowedTopics,
            blockedTopics: section?.blockedTopics,
          };
        });
      });

    console.log(
      "knowledgeIdsAndOtherRequiredInfo: ",
      knowledgeIdsAndOtherRequiredInfo,
    );

    if (knowledgeIdsAndOtherRequiredInfo?.length)
      knowledgeIdsAndOtherRequiredInfo =
        knowledgeIdsAndOtherRequiredInfo?.flat();

    console.log(
      "knowledgeIdsAndOtherRequiredInfo after flatten: ",
      knowledgeIdsAndOtherRequiredInfo,
    );

    // // Generate embeddings of user text
    const messageEmbeddings = await generateEmbedingsofMessage(
      req.body?.message,
    );

    console.log("messageEmbeddings: ", messageEmbeddings);

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
          ),
        ),
      );

    releventData = releventData.join(
      "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n",
    );

    console.log("relevent data", releventData);

    // // provide last 8 messages and relevent data from cromaDB and call ai for final result
    const content = await generateAiResponse(
      req?.body?.message,
      releventData,
      last8Message,
    );
    console.log("9");

    const newMessageUser = new Message({
      conversationId: req?.body?.conversationId,
      role: "user",
      content: req?.body?.message,
    });
    console.log("10");

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
    if (content == "Raise a ticket") {
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
    console.log("11");

    return res.send({
      success: true,
      message: "Response generated",
      humanMessage: newMessageUser,
      aiMessage: newMessageAi,
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
