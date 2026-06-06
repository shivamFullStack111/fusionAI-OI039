# Architecture & Data Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           REACT FRONTEND                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Settings.jsx                    ChatBot UI                  Dashboard   │
│  ├─ Workspace Tab              ├─ Message Input           ├─ Overview  │
│  ├─ AI Config Tab              ├─ Chat History            └─ Analytics │
│  ├─ RAG Config Tab             └─ Response Display                      │
│  └─ Topics Tab                                                          │
│                                                                          │
└──────────────────────────┬───────────────────────────────────────────────┘
                          │
                          │ HTTP/REST
                          ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS BACKEND                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Routes Layer                                                           │
│  ├─ /api/workspace/get                                                  │
│  ├─ /api/workspace/update                                               │
│  ├─ /api/workspace/ai-config/*                                          │
│  ├─ /api/workspace/rag-config/*                                         │
│  ├─ /api/workspace/*-topics/*                                           │
│  └─ /api/message/send-message  ← Main message flow                      │
│                                                                          │
└──────────────────────────┬───────────────────────────────────────────────┘
                          │
                    ┌─────┴─────┐
                    │            │
                    ↓            ↓
        ┌────────────────┐  ┌──────────────┐
        │  Controllers   │  │ AI Functions │
        │                │  │              │
        │ workspace.js   │  │ • Section    │
        │ message.js     │  │   finder     │
        │ knowledge.js   │  │ • RAG        │
        │                │  │   retrieval  │
        └────────────────┘  │ • Response   │
                 │           │   generator │
                 │           └──────────────┘
                 │                │
                 └────────┬────────┘
                         ↓
        ┌────────────────────────────┐
        │   Data & Config Layer      │
        ├────────────────────────────┤
        │  Schemas:                  │
        │  ├─ workspace.schema.js    │
        │  ├─ message.schema.js      │
        │  ├─ chatbot.schema.js      │
        │  └─ section.schema.js      │
        └────────────────────────────┘
                    │
            ┌───────┴────────┐
            │                │
            ↓                ↓
    ┌──────────────┐  ┌────────────────┐
    │  MongoDB     │  │  ChromaDB      │
    │              │  │  (Vector DB)   │
    │ • Workspace  │  │                │
    │   Config     │  │ • Embeddings   │
    │ • Messages   │  │ • Documents    │
    │ • Users      │  │ • Metadata     │
    │ • Chatbots   │  │                │
    └──────────────┘  └────────────────┘
```

---

## Message Processing Flow

```
┌─────────────────────┐
│   User Sends       │
│   Message          │
└──────────┬──────────┘
           │
           ↓
┌──────────────────────────────────────┐
│  message.controller.js               │
│  sendMessage() function              │
└──────────┬───────────────────────────┘
           │
           ├─→ Validate input
           │   └─ Check userId, chatbotId, message
           │
           ├─→ Check subscription/plan
           │   └─ Is user allowed to send message?
           │
           ├─→ Create conversation (if new)
           │   └─ Generate title with AI
           │
           ├─→ FETCH WORKSPACE CONFIG ⭐
           │   └─ getWorkspaceConfig(userId)
           │      • aiConfig, ragConfig, topics
           │
           ├─→ Find relevant sections
           │   └─ findSectionsForUserMessage()
           │      • Pass workspace config
           │      • Check topic constraints
           │
           ├─→ Select knowledge sources
           │   └─ From selected sections
           │
           ├─→ Generate message embeddings
           │   └─ Convert to vector (500-dim)
           │
           ├─→ RETRIEVE FROM VECTOR DB 🔍
           │   └─ findReleventDataFromVectorDB()
           │      • Apply ragConfig:
           │        - similarityThreshold
           │        - maxRetrievedDocuments
           │      • Filter results
           │
           ├─→ GENERATE AI RESPONSE 🧠
           │   └─ generateAiResponse()
           │      • Apply aiConfig:
           │        - defaultTone
           │        - temperature
           │        - maxTokensPerResponse
           │      • Apply topic constraints
           │      • Include conversation history
           │      • Return response
           │
           ├─→ Create message documents
           │   ├─ User message
           │   └─ AI response
           │
           └─→ Return response
               └─ To user
```

---

## Data Structure Integration

```
REQUEST BODY:
{
  userId: "user123",
  chatbotId: "bot456",
  conversationId: "conv789",
  message: "How much is shipping?",
  sections: [
    {
      sectionName: "Shipping",
      allowedTopics: ["shipping"],
      blockedTopics: [],
      knowledgeSourceIds: [...]
    }
  ],
  allMessages: [...]
}
           │
           ↓
┌──────────────────────────────┐
│ WORKSPACE CONFIG (FROM DB)   │
├──────────────────────────────┤
│ aiConfig: {                  │
│   defaultTone: "friendly"    │
│   maxTokensPerResponse: 500  │
│   temperature: 0.7           │
│   enableHistoryContext: true │
│ }                            │
│                              │
│ ragConfig: {                 │
│   similarityThreshold: 0.5   │
│   maxRetrievedDocuments: 5   │
│ }                            │
│                              │
│ globalAllowedTopics: [...]   │
│ globalBlockedTopics: [...]   │
└──────────────────────────────┘
           │
           ↓
┌──────────────────────────────┐
│ AI CONTEXT (BUILT)           │
├──────────────────────────────┤
│ • User message               │
│ • Retrieved documents (RAG)  │
│ • System prompt              │
│ • Conversation history       │
│ • Tone setting               │
│ • Topic constraints          │
│ • Token limit                │
└──────────────────────────────┘
           │
           ↓
┌──────────────────────────────┐
│ MISTRAL LLM                  │
├──────────────────────────────┤
│ temperature: 0.7             │
│ max_tokens: 500              │
│ model: mistral-small         │
└──────────────────────────────┘
           │
           ↓
    AI RESPONSE
```

---

## RAG Pipeline Details

```
KNOWLEDGE INGESTION (Once):
┌─────────────────┐
│  User uploads   │
│  document       │
└────────┬────────┘
         │
         ├─→ Parse/Summarize
         │
         ├─→ Split into chunks
         │   └─ chunkSize: 500
         │   └─ chunkOverlap: 50
         │
         ├─→ Generate embeddings
         │   └─ Cohere embeddings
         │   └─ Each chunk → 384-dim vector
         │
         └─→ Store in ChromaDB
             └─ embeddings + documents + metadata

---

QUERY TIME (On each message):
┌──────────────────┐
│  User message    │
└────────┬─────────┘
         │
         ├─→ Generate embedding
         │   └─ Same model (Cohere)
         │   └─ Message → 384-dim vector
         │
         ├─→ Vector similarity search
         │   └─ Query ChromaDB
         │   └─ Find similar documents
         │
         ├─→ Score documents
         │   └─ Cosine similarity
         │   └─ 0.0 = completely different
         │   └─ 1.0 = exactly same
         │
         ├─→ Filter by threshold
         │   └─ similarityThreshold: 0.5
         │   └─ Keep only: score ≥ 0.5
         │
         ├─→ Limit results
         │   └─ maxRetrievedDocuments: 5
         │   └─ Take top 5
         │
         └─→ Return context
             └─ To AI for response generation
```

---

## Topic Constraint Enforcement

```
┌─────────────────────┐
│  User Message       │
│  "How to refund?"   │
└─────────┬───────────┘
          │
          ↓
┌─────────────────────────────────────┐
│  isTopicAllowed()                   │
└──────────┬────────────────────────────┘
           │
           ├─→ Check BLOCKED topics
           │   │
           │   ├─ "competitor" in keywords?
           │   │  └─ "How to refund?" contains "competitor"?
           │   │     └─ NO ✓
           │   │
           │   └─ If found → REJECT
           │      └─ "I'm not able to help with that"
           │
           ├─→ Check ALLOWED topics (if defined)
           │   │
           │   ├─ "Returns & Refunds" topic?
           │   │  └─ Keywords: ["return", "refund"]
           │   │  └─ "How to refund?" matches "refund"?
           │   │     └─ YES ✓
           │   │
           │   └─ If NOT found → REJECT
           │      └─ "That's outside my scope"
           │
           └─→ If OK → CONTINUE
               └─ Generate response
```

### Topic Matching Algorithm

```
Message: "Can I refund this order?"
Allowed Topics: ["Returns & Refunds", "Shipping"]

Step 1: Normalize
  Input: "can i refund this order?"

Step 2: Check each allowed topic
  Topic: "Returns & Refunds"
    Name check: "returns & refunds" vs "can i refund this order?"
      → "refund" matches ✓
    Keywords check: ["return", "refund"]
      → "refund" matches ✓

  Result: ALLOWED ✓

Generate response using allowed topic context...
```

---

## Configuration Impact Visualization

```
Temperature Effect:
0.0  [=====█     ] 1.0
     Very consistent     Very creative
     Repetitive          Unpredictable

Token Limit Effect:
100  [=█          ] 2000
     Truncated          Detailed
     Rushed             Verbose

Similarity Threshold:
0.0  [█           ] 1.0
     Loose               Strict
     "Close" matches     "Exact" matches only

History Context:
1    [█           ] 20
     Forgets             Remembers
     Previous msgs       All previous msgs
```

---

## Integration Points

```
AI FUNCTIONS UPDATE:

BEFORE:
├─ findSectionsForUserMessage(msg, sections, history)
├─ findReleventDataFromVectorDB(embedding, knowledgeId, tone)
└─ generateAiResponse(msg, data, history)

AFTER:
├─ findSectionsForUserMessage(msg, sections, history, workspaceConfig)
│  └─ Now checks topic constraints
├─ findReleventDataFromVectorDB(embedding, knowledgeId, tone, ..., ragConfig)
│  └─ Now uses workspace RAG settings
└─ generateAiResponse(msg, data, history, workspaceConfig)
   └─ Now applies all workspace settings
```

---

## Frontend UI Layout

```
┌─────────────────────────────────────────────────┐
│  Settings                                       │
├─────────────────────────────────────────────────┤
│  [Workspace] [AI Config] [RAG] [Topics]         │
├─────────────────────────────────────────────────┤
│                                                  │
│  WORKSPACE TAB:                                  │
│  ├─ Workspace Name: [Text Input]                │
│  ├─ Primary Website: [Text Input]               │
│  ├─ Language: [Dropdown]                        │
│  └─ Timezone: [Text Input]                      │
│                                                  │
│  AI CONFIG TAB:                                  │
│  ├─ Default Tone: [Dropdown]                    │
│  ├─ Max Tokens: [Slider] 500                    │
│  ├─ Temperature: [Slider] 0.7                   │
│  ├─ History Context: [Toggle]                   │
│  └─ History Length: [Slider] 5                  │
│                                                  │
│  RAG CONFIG TAB:                                 │
│  ├─ Enable RAG: [Toggle]                        │
│  ├─ Similarity: [Slider] 0.5                    │
│  ├─ Max Docs: [Slider] 5                        │
│  ├─ Chunk Size: [Slider] 500                    │
│  ├─ Chunk Overlap: [Slider] 50                  │
│  └─ Embed Model: [Dropdown]                     │
│                                                  │
│  TOPICS TAB:                                     │
│  ├─ Topic Type: [Allowed/Blocked]               │
│  ├─ Topic Name: [Text Input]                    │
│  ├─ Description: [Text Area]                    │
│  ├─ Keywords: [Text Input]                      │
│  │                                               │
│  ├─ Allowed Topics:                              │
│  │  ├─ ✅ Billing | [Delete]                    │
│  │  └─ ✅ Shipping | [Delete]                   │
│  │                                               │
│  └─ Blocked Topics:                              │
│     ├─ 🚫 Competitor | [Delete]                 │
│     └─ 🚫 Private Info | [Delete]               │
│                                                  │
│  [Save Changes]                                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## Database Schema Relationships

```
┌──────────────┐
│   User       │
├──────────────┤
│ _id          │
│ email        │
│ password     │ ──┐
│ role         │   │
└──────────────┘   │
                   │ 1:1
                   │
                   ↓
┌──────────────────┐
│   Workspace      │
├──────────────────┤
│ _id              │
│ userId  ───────→ User._id (indexed)
│ workspaceName    │
│ aiConfig ┐       │
│ ragConfig├─ Embedded docs
│ topics   ┘       │
└──────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────┐
│   Chatbot        │
├──────────────────┤
│ _id              │
│ userId ───┐      │
│ name      │      │
│ sections  │      │
└──────────────────┘
         │
         │ 1:N
         ↓
┌──────────────────┐
│   Conversation   │
├──────────────────┤
│ _id              │
│ chatbotId        │
│ messages         │
│ title            │
└──────────────────┘

AND

┌──────────────────┐
│   ChromaDB       │
│  (Vector DB)     │
├──────────────────┤
│ embeddings []    │
│ documents []     │
│ metadatas []     │
│ (knowledgeId,    │
│  userId,         │
│  chatbotId)      │
└──────────────────┘
```

---

## Performance Characteristics

```
Operation          Time    Factors
─────────────────────────────────────────────────────
Get workspace      ~50ms   MongoDB lookup
Update workspace   ~80ms   MongoDB update
Generate embedding ~200ms  Cohere API
Vector search      ~50ms   ChromaDB (for 5 docs)
Select sections    ~300ms  LLM call (agent)
Generate response  ~1000ms LLM call (Mistral)
─────────────────────────────────────────────────────
TOTAL             ~1.7s   Per user message

(Can be optimized with caching, batching, etc.)
```

---

## Security & Validation

```
Frontend → Backend:
├─ Auth token validation (JWT)
├─ Body validation (type checking)
├─ User ownership verification
└─ Rate limiting (future)

Backend → Database:
├─ SQL injection prevention (Mongoose)
├─ XSS prevention (JSON output)
├─ User data isolation (workspaceUserId)
└─ Sensitive data not logged

Backend → External APIs:
├─ API key protection (env vars)
├─ Request rate limiting
├─ Error handling (no data leaks)
└─ Timeout protection
```

---

## Scaling Considerations

```
Current Setup:
├─ Single workspace per user
├─ Linear O(n) topic matching
└─ Sequential API calls

Scalable Setup:
├─ Multi-tenant support
├─ Indexed topic lookup
├─ Parallel API calls
├─ Caching layer (Redis)
└─ Message queue (RabbitMQ)
```

---

This comprehensive visualization shows how all components work together to deliver intelligent, configurable AI responses that respect workspace settings and RAG pipeline tuning!
