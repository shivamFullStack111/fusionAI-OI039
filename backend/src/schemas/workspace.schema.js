import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      immutable: true,
      index: true,
    },
    workspaceName: {
      type: String,
      required: true,
    },
    primaryWebsite: {
      type: String,
      default: "",
    },
    defaultLanguage: {
      type: String,
      default: "en",
      enum: ["en", "es", "fr", "de", "it", "pt", "ja", "zh", "hi"],
    },
    timezone: {
      type: String,
      default: "UTC",
    },

    // ========== AI CONFIGURATION ==========
    aiConfig: {
      defaultTone: {
        type: String,
        default: "neutral",
        enum: ["strict", "neutral", "friendly", "empathetic"],
      },
      maxTokensPerResponse: {
        type: Number,
        default: 500,
        min: 100,
        max: 2000,
      },
      temperature: {
        type: Number,
        default: 0.7,
        min: 0,
        max: 1,
      },
      enableWebSearch: {
        type: Boolean,
        default: false,
      },
      enableHistoryContext: {
        type: Boolean,
        default: true,
      },
      historyContextLength: {
        type: Number,
        default: 5,
        min: 1,
        max: 20,
      },
    },

    // ========== RAG CONFIGURATION ==========
    ragConfig: {
      enableRAG: {
        type: Boolean,
        default: true,
      },
      similarityThreshold: {
        type: Number,
        default: 0.5,
        min: 0,
        max: 1,
      },
      maxRetrievedDocuments: {
        type: Number,
        default: 5,
        min: 1,
        max: 20,
      },
      chunkSize: {
        type: Number,
        default: 500,
        min: 100,
        max: 2000,
      },
      chunkOverlap: {
        type: Number,
        default: 50,
        min: 0,
        max: 500,
      },
      embedModel: {
        type: String,
        default: "cohere",
        enum: ["cohere", "huggingface", "openai"],
      },
    },

    // ========== ALLOWED TOPICS (Global for workspace) ==========
    globalAllowedTopics: [
      {
        topic: String,
        description: String,
        keywords: [String],
      },
    ],

    // ========== BLOCKED TOPICS (Global for workspace) ==========
    globalBlockedTopics: [
      {
        topic: String,
        description: String,
        keywords: [String],
      },
    ],

    // ========== RESPONSE CONFIGURATION ==========
    responseConfig: {
      enableAutoRedirect: {
        type: Boolean,
        default: true,
      },
      enableTicketRaising: {
        type: Boolean,
        default: true,
      },
      allowOutOfScopeQuestions: {
        type: Boolean,
        default: false,
      },
      fallbackMessage: {
        type: String,
        default:
          "I'm sorry, I don't have information about that. Would you like to raise a support ticket?",
      },
      outOfScopeMessage: {
        type: String,
        default:
          "That topic is outside my scope of support. Can I help you with something else?",
      },
    },

    // ========== WORKSPACE BRANDING ==========
    branding: {
      primaryColor: {
        type: String,
        default: "#6366f1",
      },
      secondaryColor: {
        type: String,
        default: "#ffffff",
      },
      logoUrl: String,
      welcomeMessage: {
        type: String,
        default: "Hello! How can I help you today?",
      },
    },

    // ========== ANALYTICS & USAGE ==========
    usage: {
      totalMessages: {
        type: Number,
        default: 0,
      },
      totalTokensUsed: {
        type: Number,
        default: 0,
      },
      totalChatbots: {
        type: Number,
        default: 0,
      },
      lastActivityAt: Date,
    },

    // ========== STATUS ==========
    isActive: {
      type: Boolean,
      default: true,
    },

    // ========== METADATA ==========
    metadata: {
      description: String,
      industry: String,
      companySize: String,
      supportEmail: String,
      supportPhone: String,
    },
  },
  { timestamps: true },
);

export const Workspace = mongoose.model("workspace", workspaceSchema);
