# AI Agent Workspace Implementation Guide

## Overview

This document explains the complete workspace data management and RAG pipeline integration for your AI Agent system.

---

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Data Flow](#data-flow)
3. [Workspace Configuration](#workspace-configuration)
4. [RAG Pipeline](#rag-pipeline)
5. [API Endpoints](#api-endpoints)
6. [Frontend Integration](#frontend-integration)
7. [Example Usage](#example-usage)

---

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  Settings.jsx - Workspace Configuration UI                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   API Routes (/api/workspace)                │
│  • GET workspace data                                        │
│  • UPDATE workspace settings                                │
│  • Manage allowed/blocked topics                            │
│  • Configure AI & RAG                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│            Controllers & Business Logic                      │
│  workspace.controller.js - CRUD operations                  │
│  message.controller.js - Message + AI response integration  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              AI Functions & RAG Pipeline                     │
│  ai-functions.js:                                           │
│  • findSectionsForUserMessage() - Section selection         │
│  • findReleventDataFromVectorDB() - Retrieval               │
│  • generateAiResponse() - Response generation               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              External Services                              │
│  • MongoDB - Store workspace config                         │
│  • ChromaDB - Vector database for retrieval                │
│  • Mistral AI - LLM for response generation                │
│  • Cohere - Embeddings generation                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### How Data Flows from Workspace to AI Response

```
User Query
    │
    ├─→ 1. Fetch Workspace Config
    │     └─→ aiConfig, ragConfig, topics, response settings
    │
    ├─→ 2. Check Topic Constraints
    │     └─→ Is topic blocked? Is topic allowed?
    │
    ├─→ 3. Embed User Message
    │     └─→ Convert to vector using Cohere embeddings
    │
    ├─→ 4. Select Relevant Sections
    │     └─→ AI selects which sections to retrieve from
    │     └─→ Uses workspace config for context
    │
    ├─→ 5. Retrieve from Vector DB (RAG)
    │     └─→ ChromaDB queries with embedding
    │     └─→ Applies RAG config (threshold, max docs)
    │     └─→ Filters results based on similarity
    │
    ├─→ 6. Generate AI Response
    │     └─→ Pass context + config to LLM
    │     └─→ LLM respects:
    │          • Tone setting
    │          • Token limits
    │          • Temperature
    │          • Topic constraints
    │          • Response format
    │
    └─→ 7. Return Response
          └─→ Save to database
          └─→ Return to user
```

---

## ⚙️ Workspace Configuration

### Workspace Schema Structure

```javascript
{
  userId: ObjectId,              // Workspace owner
  workspaceName: String,         // "Acme Corp Support"
  primaryWebsite: String,        // "https://acme.com"
  defaultLanguage: String,       // "en", "es", "fr", etc.
  timezone: String,              // "America/New_York"

  // AI Configuration
  aiConfig: {
    defaultTone: String,           // "neutral", "friendly", "strict", "empathetic"
    maxTokensPerResponse: Number,  // 100-2000 (default: 500)
    temperature: Number,           // 0-1 (default: 0.7) - Higher = more creative
    enableWebSearch: Boolean,      // Future feature
    enableHistoryContext: Boolean, // Use conversation history
    historyContextLength: Number,  // How many messages to consider (1-20)
  },

  // RAG Configuration
  ragConfig: {
    enableRAG: Boolean,           // Enable retrieval-augmented generation
    similarityThreshold: Number,  // 0-1 (default: 0.5) - Higher = stricter matching
    maxRetrievedDocuments: Number,// 1-20 (default: 5)
    chunkSize: Number,            // 100-2000 (default: 500)
    chunkOverlap: Number,         // 0-500 (default: 50)
    embedModel: String,           // "cohere", "huggingface", "openai"
  },

  // Global Allowed Topics (AI will ONLY discuss these)
  globalAllowedTopics: [{
    topic: String,               // "Billing & Payments"
    description: String,         // "Questions about invoices and billing"
    keywords: [String]           // ["invoice", "payment", "billing"]
  }],

  // Global Blocked Topics (AI will refuse to discuss)
  globalBlockedTopics: [{
    topic: String,               // "Competitor Products"
    description: String,
    keywords: [String]           // ["competitor", "rival"]
  }],

  // Response Configuration
  responseConfig: {
    enableAutoRedirect: Boolean,
    enableTicketRaising: Boolean,
    allowOutOfScopeQuestions: Boolean,
    fallbackMessage: String,      // Used when answer not found
    outOfScopeMessage: String,    // Used when topic is out of scope
  },

  // Branding
  branding: {
    primaryColor: String,         // "#6366f1"
    secondaryColor: String,       // "#ffffff"
    logoUrl: String,
    welcomeMessage: String,       // "Hello! How can I help?"
  },

  // Usage tracking
  usage: {
    totalMessages: Number,
    totalTokensUsed: Number,
    totalChatbots: Number,
    lastActivityAt: Date,
  }
}
```

---

## 🧠 RAG Pipeline Details

### How RAG Works in Your System

**RAG** = Retrieval-Augmented Generation

1. **Knowledge Ingestion** (Knowledge Upload)

   ```
   Document → Split into chunks → Generate embeddings → Store in ChromaDB
   ```

2. **User Query Processing**

   ```
   User Message → Generate embedding (same model used for ingestion)
                → Search similar documents in ChromaDB
                → Filter by similarity threshold
                → Retrieve top N documents
   ```

3. **Context Building**

   ```
   Retrieved Documents + User Message + Config Settings
            → Build structured context
            → Pass to LLM with system prompt
   ```

4. **Response Generation**
   ```
   LLM generates response based on:
   • Retrieved context (facts)
   • System prompt (behavior)
   • AI config (tone, tokens, temperature)
   • Topic constraints (allowed/blocked)
   • Conversation history (if enabled)
   ```

### Key Parameters

| Parameter               | Default | Range    | Effect                              |
| ----------------------- | ------- | -------- | ----------------------------------- |
| `similarityThreshold`   | 0.5     | 0-1      | Higher = only very similar results  |
| `maxRetrievedDocuments` | 5       | 1-20     | More docs = more context but slower |
| `chunkSize`             | 500     | 100-2000 | Larger = more context per chunk     |
| `chunkOverlap`          | 50      | 0-500    | More overlap = better continuity    |
| `temperature`           | 0.7     | 0-1      | 0=deterministic, 1=creative         |
| `maxTokensPerResponse`  | 500     | 100-2000 | Longer = more detailed responses    |

---

## 📡 API Endpoints

### Workspace Management

```
POST /api/workspace/get
├─ Description: Fetch workspace configuration
├─ Headers: { Authorization: token }
└─ Response: { success, workspace }

POST /api/workspace/update
├─ Description: Update workspace settings
├─ Body: { workspaceName, primaryWebsite, defaultLanguage, timezone, ... }
├─ Headers: { Authorization: token }
└─ Response: { success, workspace }
```

### AI Configuration

```
POST /api/workspace/ai-config/get
├─ Description: Fetch AI settings
└─ Response: { success, aiConfig }

POST /api/workspace/ai-config/update
├─ Description: Update AI settings
├─ Body: { aiConfig: { defaultTone, temperature, ... } }
└─ Response: { success, workspace }
```

### RAG Configuration

```
POST /api/workspace/rag-config/get
├─ Description: Fetch RAG settings
└─ Response: { success, ragConfig }

POST /api/workspace/rag-config/update
├─ Description: Update RAG settings
├─ Body: { ragConfig: { similarityThreshold, maxRetrievedDocuments, ... } }
└─ Response: { success, workspace }
```

### Topic Management

```
POST /api/workspace/allowed-topics/get
├─ Description: Get all allowed topics
└─ Response: { success, topics }

POST /api/workspace/allowed-topics/add
├─ Body: { topic, description, keywords }
└─ Response: { success, workspace }

POST /api/workspace/allowed-topics/remove
├─ Body: { topicId }
└─ Response: { success, workspace }

POST /api/workspace/blocked-topics/get
POST /api/workspace/blocked-topics/add
POST /api/workspace/blocked-topics/remove
(Same pattern as allowed topics)
```

---

## 🎨 Frontend Integration

### Settings.jsx Components

#### 1. **Workspace Settings Tab**

- Configure basic workspace info
- Set language and timezone
- Save changes

#### 2. **AI Configuration Tab**

- Set default tone (neutral, friendly, strict, empathetic)
- Adjust max tokens per response
- Control temperature (creativity)
- Enable/disable conversation history
- Set history context length

#### 3. **RAG Configuration Tab**

- Enable/disable RAG pipeline
- Adjust similarity threshold
- Set max documents retrieved
- Configure chunk size and overlap
- Select embedding model

#### 4. **Topic Management Tab**

- Add allowed topics with keywords
- Add blocked topics with keywords
- Remove topics
- View current topics

---

## 💡 Example Usage

### Setting Up a Support Chatbot

#### Step 1: Configure Workspace

```javascript
// Frontend - Settings.jsx
{
  workspaceName: "Acme Support",
  primaryWebsite: "https://acme.com",
  defaultLanguage: "en",
  timezone: "America/New_York"
}
```

#### Step 2: Configure AI

```javascript
{
  aiConfig: {
    defaultTone: "friendly",           // Friendly tone
    maxTokensPerResponse: 400,         // Concise responses
    temperature: 0.6,                  // Somewhat creative
    enableHistoryContext: true,        // Remember conversation
    historyContextLength: 8            // Last 8 messages
  }
}
```

#### Step 3: Configure RAG

```javascript
{
  ragConfig: {
    enableRAG: true,
    similarityThreshold: 0.6,          // Moderate strictness
    maxRetrievedDocuments: 3,          // Few documents
    chunkSize: 400,                    // Medium chunks
    chunkOverlap: 50,                  // Some overlap
    embedModel: "cohere"               // Cohere embeddings
  }
}
```

#### Step 4: Set Topics

```javascript
// Allowed Topics
[
  {
    topic: "Billing & Payments",
    description: "Invoices, subscriptions, pricing",
    keywords: ["invoice", "payment", "billing", "price", "subscription"],
  },
  {
    topic: "Technical Support",
    description: "Account access, bugs, errors",
    keywords: ["bug", "error", "crash", "password", "login", "access"],
  },
][
  // Blocked Topics
  ({
    topic: "Competitor Products",
    keywords: ["competitor", "alternative", "rival"],
  },
  {
    topic: "Private Employee Info",
    keywords: ["salary", "ssn", "personal", "private"],
  })
];
```

#### Step 5: User Asks Question

```
User: "How can I update my billing information?"

Flow:
1. ✅ Topic Check: "billing" is in allowed topics → PASS
2. 🔍 Retrieve relevant docs from RAG
3. 🧠 Generate response using workspace config
4. 💬 AI: "You can update your billing info in Settings >
         Billing. We accept credit cards and PayPal..."
```

---

## 🔐 Topic Constraint Logic

### Priority Order

```
1. Check BLOCKED TOPICS first
   ├─ If message matches blocked topic → REJECT
   └─ Return: "I'm not able to help with that topic."

2. If ALLOWED TOPICS defined, check them
   ├─ If message matches allowed topic → PROCEED
   ├─ If message doesn't match → REJECT
   └─ Return: "That's outside my scope of support."

3. If NO ALLOWED TOPICS defined
   └─ Allow all non-blocked topics → PROCEED
```

### Keyword Matching

- Case-insensitive
- Substring matching (e.g., "bill" matches "billing", "bills")
- Checks both topic name and keywords array

Example:

```
User: "What's your billing policy?"
Blocked Topics: []
Allowed Topics: [{ topic: "Billing", keywords: ["bill", "invoice"] }]

Match: "bill" is substring of "Billing" ✅
Result: ALLOWED - proceed with response
```

---

## 📊 Data Flow in Message Controller

```javascript
sendMessage() {
  1. Validate input
  2. Check subscription/plan
  3. Create conversation if needed

  4. Fetch workspace config
     └─ Get aiConfig, ragConfig, topics, response settings

  5. Find relevant sections
     └─ Use workspace config for context

  6. Generate embeddings
     └─ Convert user message to vector

  7. Retrieve from vector DB (RAG)
     └─ Use ragConfig for max docs, similarity threshold

  8. Generate AI response
     └─ Pass workspace config to LLM
     └─ Apply topic constraints
     └─ Respect AI config settings

  9. Save messages and return response
}
```

---

## 🎯 Best Practices

### AI Configuration

- **Tone**: Match your brand voice
- **Temperature**: 0.5-0.7 for consistency, 0.8+ for creativity
- **History**: Keep 5-8 messages for context without confusion
- **Max Tokens**: 300-600 for web, 100-300 for mobile

### RAG Configuration

- **Similarity Threshold**: Start at 0.5, increase if irrelevant results
- **Max Documents**: 3-5 is usually enough, more = slower
- **Chunk Size**: 300-700 words for balanced context
- **Chunk Overlap**: 50-100 for continuity

### Topic Management

- **Allowed Topics**: Define if you want strict scope control
- **Blocked Topics**: Use for sensitive/off-topic areas
- **Keywords**: Include variations (e.g., "bill", "billing", "invoice")
- **Review Regularly**: Adjust based on user questions

---

## 🚀 Next Steps

1. **Test Workspace Config**: Try different settings in Settings page
2. **Upload Knowledge**: Add documents to test RAG
3. **Monitor Performance**: Check conversation quality
4. **Iterate**: Adjust config based on results
5. **Scale**: Add more chatbots using same workspace settings

---

## ❓ Troubleshooting

### AI Responses Too Generic

→ Increase `similarityThreshold` to get more relevant documents
→ Decrease `temperature` for more consistent responses

### AI Follows Topics Well But Responses Wrong

→ Check RAG config - may need more documents or better chunks
→ Review knowledge base quality

### Responses Cut Off

→ Increase `maxTokensPerResponse`

### Slow Response Time

→ Decrease `maxRetrievedDocuments`
→ Increase `similarityThreshold`

---

## 📞 Support

For issues or questions:

1. Check workspace configuration
2. Review RAG pipeline settings
3. Verify topic constraints are correct
4. Check knowledge base quality
