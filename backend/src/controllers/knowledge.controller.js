import { Subscription } from "../schemas/subscription.schema.js";
import { Knowledge } from "../schemas/knowledge.schema.js";
import {
  createChunks,
  fileTextReader,
  generateEmbedingsOfChunks,
  storeInVectorDB,
  summarizeData,
  webScrap,
} from "../utils/functions.js";
import { Chatbot } from "../schemas/chatbot.schema.js";
import { Section } from "../schemas/section.schema.js";
import { collection } from "../config/vectorDatabaseConfig.js";
import { denyMemberAction, getWorkspaceUserId } from "../utils/workspace.js";

export const addKnowledge = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);

    if (!req?.body?.knowledgeType)
      return res.send({
        success: false,
        message: "Knowledge type is required",
      });

    const { knowledgeType } = req?.body;

    const userCurrentPlan = req.userCurrentPlan;

    const userTotalKnowledges = await Knowledge.countDocuments({
      userId,
    });

    if (userTotalKnowledges >= userCurrentPlan.planId.totalKnowledges) {
      return res.send({
        success: false,
        message: "You reached maximum knowledges of your current plan",
      });
    }

    const user_chatbot = await Chatbot.findOne({ userId });

    if (!user_chatbot)
      return res.send({
        success: false,
        message: "User chatbot does'nt exist",
      });

    // TYPE: WEBSITE
    if (knowledgeType == "website") {
      const { websiteUrl } = req.body;

      if (!websiteUrl)
        return res.send({ success: false, message: "Website url is required" });

      const websiteData = await webScrap(websiteUrl);

      const { content: summarizedData } = await summarizeData(websiteData);

      const newKnowledge = new Knowledge({
        userId,
        knowledgeType: "website",
        webite: {
          url: websiteUrl,
          content: summarizedData,
        },
      });

      await newKnowledge.save();

      // storing knowledge id if this function throw error and failed to store vectors in db then delete knowledge
      req.knowledgeId = newKnowledge._id;

      const chunks = createChunks(summarizedData);

      const { embeddings, ids, documents, metadatas } =
        await generateEmbedingsOfChunks(
          chunks,
          newKnowledge?._id,
          userId,
          user_chatbot?._id,
        );

      await storeInVectorDB(embeddings, ids, documents, metadatas);

      return res.send({
        success: true,
        message: "Knowledge added",
        knowledge: newKnowledge,
      });
    }

    // TYPE: TEXT
    if (knowledgeType == "text") {
      const { title, content } = req?.body;

      if (!title || !content)
        return res.send({
          success: false,
          message: "Title and Content is required",
        });

      const { content: summarizedData } = await summarizeData(content, title);

      const newKnowledge = new Knowledge({
        userId,
        knowledgeType: "text",
        text: {
          title: title,
          content: summarizedData,
        },
      });

      await newKnowledge.save();

      // storing knowledge id if this function throw error and failed to store vectors in db then delete knowledge
      req.knowledgeId = newKnowledge._id;

      const chunks = createChunks(summarizedData);

      const { embeddings, ids, documents, metadatas } =
        await generateEmbedingsOfChunks(
          chunks,
          newKnowledge?._id,
          userId,
          user_chatbot?._id,
        );

      await storeInVectorDB(embeddings, ids, documents, metadatas);

      return res.send({
        success: true,
        message: "Knowledge added",
        knowledge: newKnowledge,
      });
    }

    // TYPE: FILE
    if (knowledgeType == "file") {
      const fileText = await fileTextReader(req.file);

      const { content: summarizedData } = await summarizeData(fileText);

      const newKnowledge = new Knowledge({
        userId,
        knowledgeType: "file",
        file: {
          fileType: req.file?.mimetype,
          fileName: req.file?.originalname,
          content: summarizedData,
        },
      });

      await newKnowledge.save();

      // storing knowledge id if this function throw error and failed to store vectors in db then delete knowledge
      req.knowledgeId = newKnowledge._id;

      const chunks = createChunks(summarizedData);

      const { embeddings, ids, documents, metadatas } =
        await generateEmbedingsOfChunks(
          chunks,
          newKnowledge?._id,
          userId,
          user_chatbot?._id,
        );

      await storeInVectorDB(embeddings, ids, documents, metadatas);

      return res.send({
        success: true,
        message: "Knowledge added",
        knowledge: newKnowledge,
      });
    }
  } catch (error) {
    if (req.knowledgeId) {
      await Knowledge.findByIdAndDelete(req.knowledgeId);
    }
    return res.send({ success: false, message: error.message });
  }
};

export const getAllKnowledge = async (req, res) => {
  try {
    let conditions = {};
    if (req?.body?.knowledgeType) {
      conditions = { ...conditions, knowledgeType: req.body?.knowledgeType };
    }
    if (req?.body?.isActive == true) {
      conditions = {
        ...conditions,
        isActive: true,
      };
    }
    if (req?.body?.isActive == false) {
      conditions = {
        ...conditions,
        isActive: false,
      };
    }

    console.log(conditions);

    const knowledges = await Knowledge.find({
      userId: getWorkspaceUserId(req.user),
      ...conditions,
    }).sort({ createdAt: -1 });

    return res.send({ success: true, message: "Knowledges get", knowledges });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteKnowledge = async (req, res) => {
  try {
    if (denyMemberAction(req, res, "delete knowledge")) return;

    if (!req?.body?.knowledgeId)
      return res.send({ success: false, message: "Knowledge id is required" });
    const workspaceUserId = getWorkspaceUserId(req.user);

    const sections = await Section.updateMany(
      {
        knowledgeSourceIds: req?.body?.knowledgeId,
        userId: workspaceUserId,
      },
      { $pull: { knowledgeSourceIds: req?.body?.knowledgeId } },
    );

    const deletedKnowledge = await Knowledge.findOneAndDelete({
      _id: req?.body?.knowledgeId,
      userId: workspaceUserId,
    });

    if (!deletedKnowledge) {
      return res
        .status(404)
        .send({ success: false, message: "Knowledge not found" });
    }

    // deleting knowledge embeddings from vector db
    await collection.delete({
      where: { knowledgeId: req?.body?.knowledgeId }, //where
    });
    
    return res.send({ success: true, message: "Knowledge deleted" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

export const updateKnowledge = async (req, res) => {
  try {
    if (!req?.body?.knowledgeId)
      return res.send({ success: false, message: "Knowledge id is required" });
    if (!req?.body?.isActive == true && !req?.body?.isActive == false) {
      return res.send({ success: false, message: "isActive is required" });
    }

    const knowledge = await Knowledge.findOneAndUpdate(
      { _id: req?.body?.knowledgeId, userId: getWorkspaceUserId(req.user) },
      {
        $set: {
          isActive: req?.body?.isActive,
        },
      },
      { returnDocument: "after" },
    );

    return res.send({ success: true, message: "Knowledge updated", knowledge });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};
