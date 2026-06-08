// npm install @mendable/firecrawl-js
import Firecrawl from "@mendable/firecrawl-js";
import { embeddingsGenerator, llm } from "../config/aiConfig.js";
import { collection } from "../config/vectorDatabaseConfig.js";
import { v4 as uuidv4 } from "uuid";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import WordExtractor from "word-extractor";
import Cookies from "js-cookie";
import { Subscription } from "../schemas/subscription.schema.js";

export const setRefreshTokenCookies = (res, refreshToken) => {
  try {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.FRONTEND_URL ? true : false,
      sameSite: process.env.FRONTEND_URL ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/", // 🔥 add this
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.FRONTEND_URL ? true : false,
    sameSite: process.env.FRONTEND_URL ? "none" : "lax",
    path: "/",
  });
};

export const webScrap = async (url) => {
  const app = new Firecrawl({ apiKey: process.env.FIRECRWL_API_KEY });

  // Scrape a website:
  const result = await app.scrape(url);

  const scrapedData = result.markdown;

  // Step 2 — Clean karo
  const cleanContent = scrapedData
    .replace(/\[.*?\]\(.*?\)/g, "") // markdown links remove
    .replace(/#{1,6}\s/g, "") // headings ke # remove
    .replace(/\n{3,}/g, "\n\n") // extra newlines remove
    .trim();

  return cleanContent;
};

export const summarizeData = async (content, title) => {
  try {
    let titleContent = title ? `TITLE: ${title}` : null;

    // const messages = ;
    const result = await llm.invoke([
      {
        role: "system",
        content: `You are an expert content summarizer. 
Your job is to summarize website content that has been scraped.

Follow these rules strictly:
- Keep all important information like prices, features, contact details, product names, and key facts
- Remove all navigation menus, footers, cookie banners, ads, and repeated headers
- Structure the summary in clean paragraphs
- Do not add any information that is not present in the original content
- Do not use phrases like "This website says..." just write the information directly
- Keep the summary concise but informative`,
      },
      {
        role: "user",
        content: ` ${titleContent ? titleContent : null} CONTENT: ${content}`,
      },
    ]);

    return {
      content: result.content,
      inputTokens: result.usage_metadata.input_tokens,
      outputTokens: result.usage_metadata.output_tokens,
      totalTokens:
        result.usage_metadata.input_tokens +
        result.usage_metadata.output_tokens,
    };
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const createChunks = (text, chunkSize = 500, overlap = 50) => {
  const words = text.split(" ");
  const chunks = [];
  let index = 0;

  while (index < words.length) {
    const chunk = words.slice(index, index + chunkSize).join(" ");
    chunks.push(chunk);
    index += chunkSize - overlap; // har baar same step
  }

  return chunks;
  // Har chunk:
  // slice(0, 500)    → 500 words ✅
  // slice(450, 950)  → 500 words ✅
  // slice(900, 1400) → 500 words ✅
  // Overlap: 50 words repeat hote hain ✅
};

export const generateEmbedingsOfChunks = async (
  chunks,
  knowledgeId,
  userId,
  chatbotId,
) => {
  // provide array of text in parameter
  try {
    const result = await embeddingsGenerator.embedDocuments(chunks);

    const embeddings = [];
    const ids = [];
    const documents = [];
    const metadatas = [];

    result.every((emb, i) => {
      embeddings.push(emb);
      ids.push(uuidv4());
      documents.push(chunks[i]);
      metadatas.push({
        knowledgeId: knowledgeId.toString(),
        userId: userId.toString(),
        chatbotId: chatbotId.toString(),
        createdAt: Date.now(),
      });
    });

    return {
      embeddings,
      ids,
      documents,
      metadatas,
    };
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const generateEmbedingsofMessage = async (message) => {
  try {
    const result = await embeddingsGenerator.embedQuery(message);
    // console.log(result);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const storeInVectorDB = async (
  embeddings,
  ids,
  documents,
  metadatas,
) => {
  try {
    await collection.add({
      ids,
      documents,
      embeddings,
      metadatas,
    });

    return true;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

export const fileTextReader = async (file) => {
  const fileType = file?.mimetype;

  if (
    fileType == "text/plain" ||
    fileType == "text/csv" ||
    fileType == "text/markdown"
  ) {
    let content = file.buffer.toString("utf-8");
    return content;
  }

  if (fileType == "application/pdf") {
    const bytes = new Uint8Array(file.buffer);

    const parser = new PDFParse(bytes);

    const result = await parser.getText();
    const cleanText = result.text
      .replace(/-- \d+ of \d+ --/g, "") // "-- 1 of 1 --" remove
      .replace(/\s+/g, " ") // extra spaces/newlines clean karo
      .trim();

    if (cleanText) {
      return cleanText;
    }

    throw new Error(
      "File doesnt contain any text. or file is a image-based PDF. provide text-based PDF",
    );
  }

  if (
    fileType ==
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const bytes = new Uint8Array(file.buffer);

    const result = await mammoth.extractRawText(bytes);

    return result.value;
  }

  // unsupported file type
  throw new Error(`Unsupported file type: ${fileType}`);
};

export const isSubscribed_function = async (req, res, userId) => {
  try {
    const userCurrentPlan = await Subscription.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate("planId");


    if (!userCurrentPlan) throw new Error("You have to purchase plan");

    // return res.send({ success: false, message: "You have to purchase plan" });

    const endDate = new Date(userCurrentPlan.endDate);
    const today = new Date(Date.now());

    const isExpired = today > endDate;

    if (isExpired) throw new Error("Your current plan is expired");

    // return res.send({
    //   success: false,
    //   message: "Your current plan is expired",
    // });

    return userCurrentPlan;
  } catch (error) {
    // return res.send({ success: false, message: error.message });
    throw new Error(error.message);
  }
};
