import { Workspace } from "../schemas/workspace.schema.js";
import { getWorkspaceUserId } from "../utils/workspace.js";

// ========== GET WORKSPACE ==========
export const getWorkspace = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);

    let workspace = await Workspace.findOne({ userId });

    if (!workspace) {
      // Create default workspace if not exists
      workspace = new Workspace({
        userId,
        workspaceName: req.user?.name || "My Workspace",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      await workspace.save();
    }

    return res.send({
      success: true,
      message: "Workspace fetched successfully",
      workspace,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== UPDATE WORKSPACE ==========
export const updateWorkspace = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);
    const {
      workspaceName,
      primaryWebsite,
      defaultLanguage,
      timezone,
      aiConfig,
      ragConfig,
      responseConfig,
      branding,
      metadata,
      globalAllowedTopics,
      globalBlockedTopics,
    } = req.body;

    const updateData = {};

    if (workspaceName) updateData.workspaceName = workspaceName;
    if (primaryWebsite) updateData.primaryWebsite = primaryWebsite;
    if (defaultLanguage) updateData.defaultLanguage = defaultLanguage;
    if (timezone) updateData.timezone = timezone;

    if (aiConfig) updateData.aiConfig = aiConfig;
    if (ragConfig) updateData.ragConfig = ragConfig;
    if (responseConfig) updateData.responseConfig = responseConfig;
    if (branding) updateData.branding = branding;
    if (metadata) updateData.metadata = metadata;
    if (globalAllowedTopics)
      updateData.globalAllowedTopics = globalAllowedTopics;
    if (globalBlockedTopics)
      updateData.globalBlockedTopics = globalBlockedTopics;

    updateData.lastActivityAt = new Date();

    const workspace = await Workspace.findOneAndUpdate({ userId }, updateData, {
      new: true,
      upsert: true,
    });

    return res.send({
      success: true,
      message: "Workspace updated successfully",
      workspace,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== UPDATE AI CONFIG ==========
export const updateAIConfig = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);
    const { aiConfig } = req.body;

    if (!aiConfig) {
      return res.send({
        success: false,
        message: "AI configuration is required",
      });
    }

    const workspace = await Workspace.findOneAndUpdate(
      { userId },
      { aiConfig, updatedAt: new Date() },
      { new: true },
    );

    return res.send({
      success: true,
      message: "AI configuration updated successfully",
      workspace,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== UPDATE RAG CONFIG ==========
export const updateRAGConfig = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);
    const { ragConfig } = req.body;

    if (!ragConfig) {
      return res.send({
        success: false,
        message: "RAG configuration is required",
      });
    }

    const workspace = await Workspace.findOneAndUpdate(
      { userId },
      { ragConfig, updatedAt: new Date() },
      { new: true },
    );

    return res.send({
      success: true,
      message: "RAG configuration updated successfully",
      workspace,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== ADD ALLOWED TOPIC ==========
export const addAllowedTopic = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);
    const { topic, description, keywords } = req.body;

    if (!topic) {
      return res.send({
        success: false,
        message: "Topic is required",
      });
    }

    const workspace = await Workspace.findOneAndUpdate(
      { userId },
      {
        $push: {
          globalAllowedTopics: {
            topic,
            description,
            keywords: keywords || [],
          },
        },
        updatedAt: new Date(),
      },
      { new: true },
    );

    return res.send({
      success: true,
      message: "Allowed topic added successfully",
      workspace,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== REMOVE ALLOWED TOPIC ==========
export const removeAllowedTopic = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);
    const { topicId } = req.body;

    if (!topicId) {
      return res.send({
        success: false,
        message: "Topic ID is required",
      });
    }

    const workspace = await Workspace.findOneAndUpdate(
      { userId },
      {
        $pull: { globalAllowedTopics: { _id: topicId } },
        updatedAt: new Date(),
      },
      { new: true },
    );

    return res.send({
      success: true,
      message: "Allowed topic removed successfully",
      workspace,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== ADD BLOCKED TOPIC ==========
export const addBlockedTopic = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);
    const { topic, description, keywords } = req.body;

    if (!topic) {
      return res.send({
        success: false,
        message: "Topic is required",
      });
    }

    const workspace = await Workspace.findOneAndUpdate(
      { userId },
      {
        $push: {
          globalBlockedTopics: {
            topic,
            description,
            keywords: keywords || [],
          },
        },
        updatedAt: new Date(),
      },
      { new: true },
    );

    return res.send({
      success: true,
      message: "Blocked topic added successfully",
      workspace,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== REMOVE BLOCKED TOPIC ==========
export const removeBlockedTopic = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);
    const { topicId } = req.body;

    if (!topicId) {
      return res.send({
        success: false,
        message: "Topic ID is required",
      });
    }

    const workspace = await Workspace.findOneAndUpdate(
      { userId },
      {
        $pull: { globalBlockedTopics: { _id: topicId } },
        updatedAt: new Date(),
      },
      { new: true },
    );

    return res.send({
      success: true,
      message: "Blocked topic removed successfully",
      workspace,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET ALLOWED TOPICS ==========
export const getAllowedTopics = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);

    const workspace = await Workspace.findOne({ userId }).select(
      "globalAllowedTopics",
    );

    return res.send({
      success: true,
      topics: workspace?.globalAllowedTopics || [],
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET BLOCKED TOPICS ==========
export const getBlockedTopics = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);

    const workspace = await Workspace.findOne({ userId }).select(
      "globalBlockedTopics",
    );

    return res.send({
      success: true,
      topics: workspace?.globalBlockedTopics || [],
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET RAG CONFIG ==========
export const getRAGConfig = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);

    const workspace = await Workspace.findOne({ userId }).select("ragConfig");

    return res.send({
      success: true,
      ragConfig: workspace?.ragConfig,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

// ========== GET AI CONFIG ==========
export const getAIConfig = async (req, res) => {
  try {
    const userId = getWorkspaceUserId(req.user);

    const workspace = await Workspace.findOne({ userId }).select("aiConfig");

    return res.send({
      success: true,
      aiConfig: workspace?.aiConfig,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
