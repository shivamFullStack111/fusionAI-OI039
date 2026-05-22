import { ChatMistralAI } from "@langchain/mistralai";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { CohereEmbeddings } from "@langchain/cohere";

import dotenv from "dotenv";
dotenv.config();

export const llm = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  modelName: "mistral-small",
  temperature: 1,
  maxRetries: 2,
});

export const embeddingsGenerator = new CohereEmbeddings({
  model: "embed-english-light-v3.0",
  apiKey: process.env.COHERE_API_KEY,
});
