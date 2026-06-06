# Quick Reference Guide - Workspace & RAG Integration

## 🎯 Quick Start

### 1. User Updates Settings in Frontend

```
Settings.jsx → API Call → /api/workspace/update → Save to MongoDB
```

### 2. AI Uses Workspace Config in Response

```
message.controller.js → getWorkspaceConfig() → Pass to AI functions
```

### 3. RAG Pipeline Uses Settings

```
findReleventDataFromVectorDB() → Apply ragConfig → Return filtered data
```

---

## 📋 Workspace Config Structure

```javascript
// What gets stored in MongoDB
Workspace {
  userId: "user123",
  workspaceName: "Acme Support",

  // 🧠 AI Behavior
  aiConfig: {
    defaultTone: "friendly",           // How AI sounds
    maxTokensPerResponse: 500,         // Response length
    temperature: 0.7,                  // Creativity (0=strict, 1=creative)
    enableHistoryContext: true,        // Remember past messages
    historyContextLength: 5            // How many past messages
  },

  // 🔍 Retrieval Settings
  ragConfig: {
    enableRAG: true,
    similarityThreshold: 0.5,          // Strictness (0=lenient, 1=strict)
    maxRetrievedDocuments: 5,          // Max docs to retrieve
    chunkSize: 500,                    // Size of text chunks
    chunkOverlap: 50                   // Overlap between chunks
  },

  // ✅ Allowed Topics (whitelist)
  globalAllowedTopics: [
    {
      topic: "Billing",
      keywords: ["bill", "invoice", "payment"]
    }
  ],

  // 🚫 Blocked Topics (blacklist)
  globalBlockedTopics: [
    {
      topic: "Competitor",
      keywords: ["rival", "competitor"]
    }
  ]
}
```

---

## 🔌 API Calls Quick Reference

### Get Current Workspace

```javascript
const response = await axios.post(
  "/api/workspace/get",
  {},
  {
    headers: { Authorization: token },
  },
);
// Returns: { success: true, workspace: {...} }
```

### Update AI Config

```javascript
await axios.post(
  "/api/workspace/ai-config/update",
  {
    aiConfig: {
      defaultTone: "professional",
      temperature: 0.5,
      maxTokensPerResponse: 300,
    },
  },
  {
    headers: { Authorization: token },
  },
);
```

### Update RAG Config

```javascript
await axios.post(
  "/api/workspace/rag-config/update",
  {
    ragConfig: {
      similarityThreshold: 0.6,
      maxRetrievedDocuments: 3,
    },
  },
  {
    headers: { Authorization: token },
  },
);
```

### Add Topic

```javascript
await axios.post(
  "/api/workspace/allowed-topics/add",
  {
    topic: "Returns & Refunds",
    description: "Return policies",
    keywords: ["return", "refund", "exchange"],
  },
  {
    headers: { Authorization: token },
  },
);
```

---

## 🧠 AI Functions Integration

### Function: getWorkspaceConfig()

```javascript
const config = await getWorkspaceConfig(userId);
// Returns workspace config or defaults
```

### Function: isTopicAllowed()

```javascript
const check = isTopicAllowed(message, allowedTopics, blockedTopics);
if (!check.allowed) {
  // Topic is blocked or not in allowed list
}
```

### Function: findReleventDataFromVectorDB()

```javascript
const data = await findReleventDataFromVectorDB(
  embeddings,
  knowledgeId,
  tone,
  allowedTopics,
  blockedTopics,
  ragConfig, // ← NEW: Uses workspace RAG config
);
```

### Function: generateAiResponse()

```javascript
const response = await generateAiResponse(
  userMessage,
  relevantData,
  conversationHistory,
  workspaceConfig, // ← NEW: Uses all workspace settings
);
// Response respects: tone, tokens, temperature, topics, history
```

---

## 🎨 Frontend Tab Breakdown

### Workspace Tab

- Change workspace name
- Update website URL
- Select language
- Set timezone

### AI Config Tab

- **Tone Selector**: neutral, friendly, strict, empathetic
- **Max Tokens Slider**: 100-2000 (response length)
- **Temperature Slider**: 0-1 (creativity level)
- **History Toggle**: Enable/disable conversation context
- **History Length Slider**: 1-20 (messages to remember)

### RAG Config Tab

- **Enable RAG Toggle**: Turn RAG on/off
- **Similarity Threshold**: 0-1 (match strictness)
- **Max Documents**: 1-20 (retrieval limit)
- **Chunk Size**: 100-2000 (text piece size)
- **Chunk Overlap**: 0-500 (overlap between pieces)
- **Model Selector**: cohere, huggingface, openai

### Topics Tab

- **Add Topic**: Fill form to create topic
- **Remove Topic**: Click delete on existing topic
- **View Topics**: List all allowed/blocked topics
- **Edit Keywords**: Manage keywords for matching

---

## 💡 Common Scenarios

### Scenario 1: Strict Support Bot

```javascript
{
  aiConfig: {
    defaultTone: "professional",
    temperature: 0.3,           // Less creative
    maxTokensPerResponse: 300,  // Concise
  },
  ragConfig: {
    similarityThreshold: 0.7,   // Only exact matches
    maxRetrievedDocuments: 2
  }
}
```

### Scenario 2: Friendly Helper Bot

```javascript
{
  aiConfig: {
    defaultTone: "friendly",
    temperature: 0.8,           // More creative
    maxTokensPerResponse: 600   // More detailed
  },
  ragConfig: {
    similarityThreshold: 0.4,   // Loose matching
    maxRetrievedDocuments: 5
  }
}
```

### Scenario 3: Specialized Expert

```javascript
{
  globalAllowedTopics: [
    { topic: "Technical", keywords: [...] },
    { topic: "API", keywords: [...] }
  ],
  globalBlockedTopics: [
    { topic: "Pricing", keywords: [...] },
    { topic: "Sales", keywords: [...] }
  ]
}
```

---

## 🔍 How Topic Matching Works

```
User Message: "Can I refund this order?"

Check Blocked: "refund" not in blocked topics ✅
Check Allowed: "refund" matches "Returns & Refunds" topic ✅
Result: ALLOWED → Continue to response generation

---

User Message: "Who's your competitor?"

Check Blocked: "competitor" matches blocked topic 🚫
Result: BLOCKED → Return "I'm not able to help with that topic."
```

### Keyword Matching Rules

- ✅ Case-insensitive
- ✅ Substring matching (e.g., "bill" matches "billing")
- ✅ Checks topic name + keywords array
- ✅ Any match = allowed/blocked

---

## 📊 Configuration Impact

| Setting        | Low Value          | High Value          |
| -------------- | ------------------ | ------------------- |
| Temperature    | Consistent, boring | Creative, risky     |
| Max Tokens     | Brief, cut-off     | Detailed, long      |
| Similarity     | Loose matching     | Strict matching     |
| Max Docs       | Fast, incomplete   | Slow, comprehensive |
| History Length | Forgets quickly    | Long context        |

---

## 🐛 Debugging Tips

### Check Workspace Config

```javascript
// In message controller
console.log("Workspace Config:", workspaceConfig);
// Verify aiConfig, ragConfig, topics are present
```

### Check Topic Enforcement

```javascript
// In ai-functions.js
const check = isTopicAllowed(message, allowed, blocked);
console.log("Topic Check:", check);
// Should show reason if blocked
```

### Check RAG Retrieval

```javascript
// In ai-functions.js
console.log("Retrieved docs:", filteredDocuments.length);
console.log("Threshold:", ragConfig.similarityThreshold);
// Verify correct number of documents returned
```

### Check Response Generation

```javascript
// In ai-functions.js
console.log("Using config:", {
  tone: aiConfig.defaultTone,
  tokens: aiConfig.maxTokensPerResponse,
  temperature: aiConfig.temperature,
});
```

---

## 🚀 Deployment Checklist

- [ ] Workspace schema migrations run
- [ ] Routes registered in index.js
- [ ] Frontend Settings component deployed
- [ ] API endpoints tested
- [ ] Topic matching verified
- [ ] RAG config applied correctly
- [ ] AI responses respecting tone/tokens
- [ ] Error handling in place
- [ ] Workspace created on first user access
- [ ] Default configs set appropriately

---

## 📚 Documentation Links

- Full Guide: `backend/WORKSPACE_RAG_GUIDE.md`
- Implementation Summary: `IMPLEMENTATION_SUMMARY.md`
- This Quick Reference: `QUICK_REFERENCE.md`

---

## ⚡ Performance Tips

### Faster Responses

- Lower `similarityThreshold`
- Reduce `maxRetrievedDocuments`
- Disable `enableHistoryContext`
- Use `temperature: 0.3-0.5`

### More Accurate

- Raise `similarityThreshold`
- Increase `maxRetrievedDocuments`
- Enable `enableHistoryContext`
- Use larger `chunkSize`

### Better Control

- Define `globalAllowedTopics`
- Add `globalBlockedTopics`
- Adjust `similarityThreshold`
- Set strict `tone`

---

## 🎯 Next: Testing Your Setup

1. **Backend Ready?**

   ```bash
   npm install
   node src/index.js
   ```

2. **Frontend Ready?**

   ```bash
   npm install
   npm run dev
   ```

3. **Test API?**

   ```bash
   POST /api/workspace/get
   ```

4. **Check Settings UI?**

   ```
   Navigate to /dashboard/settings
   ```

5. **Test RAG?**
   - Upload knowledge
   - Ask question
   - Verify response respects config

---

## 🎓 Learning Path

1. Read: `WORKSPACE_RAG_GUIDE.md` - Understand architecture
2. Review: `workspace.schema.js` - See data structure
3. Check: `workspace.controller.js` - See CRUD operations
4. Explore: `ai-functions.js` - See integration
5. Test: Use Settings UI to adjust config
6. Monitor: Check console logs for config usage

---

## 💬 Common Questions

**Q: Why are responses still generic?**
A: Check workspace RAG config - may need more documents or lower threshold

**Q: Topics not working?**
A: Verify keywords in topic config, ensure they're in user message

**Q: Settings not saving?**
A: Check auth token, verify API endpoint response

**Q: Slow responses?**
A: Reduce `maxRetrievedDocuments`, increase `similarityThreshold`

---

## 🎉 You're All Set!

Your workspace management system is ready to use. Adjust configurations in the Settings UI and watch how they affect AI responses in real-time!
