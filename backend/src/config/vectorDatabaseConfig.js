import { CloudClient } from "chromadb";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.CROMADB_API_KEY)

export const client = new CloudClient({
  tenant: "eaa3776a-db41-4d0e-a6da-def192620f3d",
  database: "ai-agent",
  apiKey: process.env.CROMADB_API_KEY,
});

export const collection = await client.getOrCreateCollection({
  name: "knowledges",
  embeddingFunction:null
});
