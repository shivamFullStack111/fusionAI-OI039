// import {
//   ChatGoogleGenerativeAI,
//   GoogleGenerativeAIEmbeddings,
// } from "@langchain/google-genai";

import { ChatGroq } from "@langchain/groq";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { CohereEmbeddings } from "@langchain/cohere";

import dotenv from "dotenv";
dotenv.config();

// export const llm = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash-lite",
//   temperature: 0.5,
//   maxRetries: 2,
//   apiKey: process.env.GOOGLE_API_KEY,
// });

// export const embeddingsGenerator = new GoogleGenerativeAIEmbeddings({
//   model: "gemini-embedding-001",
//   apiKey: process.env.GOOGLE_API_KEY,
// });

export const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 1,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY,
});

export const embeddingsGenerator = new CohereEmbeddings({
  model: "embed-english-light-v3.0",
  apiKey: process.env.COHERE_API_KEY,
});
