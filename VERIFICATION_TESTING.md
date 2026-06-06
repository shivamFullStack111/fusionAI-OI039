# Verification & Testing Guide

## ✅ Verification Checklist

### Backend Files Created/Updated

- [ ] `backend/src/schemas/workspace.schema.js` exists

  ```bash
  ls -la backend/src/schemas/workspace.schema.js
  ```

- [ ] `backend/src/controllers/workspace.controller.js` exists

  ```bash
  ls -la backend/src/controllers/workspace.controller.js
  ```

- [ ] `backend/src/routes/workspace.routes.js` exists

  ```bash
  ls -la backend/src/routes/workspace.routes.js
  ```

- [ ] `backend/src/index.js` includes workspace routes

  ```bash
  grep "workspace" backend/src/index.js
  # Should see: import workspaceRoutes and app.use
  ```

- [ ] `backend/src/utils/ai/ai-functions.js` enhanced

  ```bash
  grep "getWorkspaceConfig\|isTopicAllowed" backend/src/utils/ai/ai-functions.js
  # Should find both functions
  ```

- [ ] `backend/src/controllers/message.controller.js` updated
  ```bash
  grep "getWorkspaceConfig" backend/src/controllers/message.controller.js
  # Should find workspace config usage
  ```

### Frontend Files Updated

- [ ] `frontend/src/pages/dashboard/Settings.jsx` rewritten
  ```bash
  grep "Tabs\|AIConfigSettings\|RAGConfigSettings\|TopicManagement" \
    frontend/src/pages/dashboard/Settings.jsx
  # Should find all new components
  ```

### Documentation Created

- [ ] `IMPLEMENTATION_SUMMARY.md` exists
- [ ] `QUICK_REFERENCE.md` exists
- [ ] `ARCHITECTURE.md` exists
- [ ] `backend/WORKSPACE_RAG_GUIDE.md` exists

---

## 🧪 Testing Procedures

### Step 1: Start Backend

```bash
cd backend
npm install
node src/index.js

# Should see:
# - Server running on port 7474
# - Database connected
# - No errors
```

### Step 2: Start Frontend

```bash
cd frontend
npm install
npm run dev

# Should see:
# - Vite dev server running
# - http://localhost:5173
```

### Step 3: Test Workspace Endpoint

```bash
# Open Terminal and test API
curl -X POST http://localhost:7474/api/workspace/get \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Should return:
# {
#   "success": true,
#   "workspace": {
#     "_id": "...",
#     "workspaceName": "...",
#     "aiConfig": {...},
#     "ragConfig": {...}
#   }
# }
```

### Step 4: Test Frontend Settings

1. Navigate to `http://localhost:5173/dashboard/settings`
2. Login with your account
3. Click on each tab:

#### Workspace Tab

- [ ] Workspace name loads
- [ ] Primary website field shows
- [ ] Language selector works
- [ ] Timezone displays
- [ ] Save button works
- [ ] Toast notification appears

#### AI Config Tab

- [ ] Tone selector shows options (neutral, friendly, strict, empathetic)
- [ ] Sliders work smoothly
- [ ] Values update in real-time
- [ ] Save button works
- [ ] Confirmation toast appears

#### RAG Config Tab

- [ ] Enable RAG toggle works
- [ ] Similarity threshold slider 0-1
- [ ] Max documents slider 1-20
- [ ] Chunk size slider 100-2000
- [ ] Chunk overlap slider 0-500
- [ ] Embedding model dropdown works
- [ ] Save button works

#### Topics Tab

- [ ] Topic type selector works
- [ ] Can add new topic
- [ ] Keywords comma-separated input works
- [ ] Topics list displays
- [ ] Delete button removes topics
- [ ] Allowed/blocked topics separated correctly

### Step 5: Test API Endpoints

```bash
# Test Update Workspace
curl -X POST http://localhost:7474/api/workspace/update \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceName": "Test Workspace",
    "primaryWebsite": "https://test.com"
  }'

# Test Update AI Config
curl -X POST http://localhost:7474/api/workspace/ai-config/update \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "aiConfig": {
      "defaultTone": "friendly",
      "temperature": 0.7
    }
  }'

# Test Add Allowed Topic
curl -X POST http://localhost:7474/api/workspace/allowed-topics/add \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Billing",
    "description": "Billing questions",
    "keywords": ["bill", "invoice", "payment"]
  }'

# Should all return success: true
```

### Step 6: Test Message with Workspace Config

1. Upload a document as knowledge
2. Create a section with that knowledge
3. Create a chatbot with that section
4. Send a message in chatbot

#### Expected Behavior

- Message processed through updated controller
- Workspace config fetched
- Topic constraints checked
- RAG retrieval uses workspace settings
- Response respects AI config (tone, tokens, temperature)

### Step 7: Verify Logs

In backend console, you should see:

```
=== generateAiResponse with Workspace Config ===
userMessage: "Your question"
releventData length: 1234
workspaceConfig: {
  aiConfig: { ... },
  ragConfig: { ... },
  globalAllowedTopics: [ ... ],
  globalBlockedTopics: [ ... ]
}
```

---

## 🔍 Debugging Guide

### Issue: Workspace endpoint returns error

**Check:**

```bash
# Verify route exists
grep "workspace" backend/src/index.js

# Verify auth middleware applied
grep "auth" backend/src/routes/workspace.routes.js

# Check MongoDB connection
# Look for connection logs in console
```

### Issue: Settings page won't load

**Check:**

```bash
# Open browser dev tools (F12)
# Check Network tab for API calls
# Check Console tab for errors
# Verify token is sent in headers
```

### Issue: Workspace config not used in responses

**Check:**

```bash
# Look at backend logs for "getWorkspaceConfig"
# Verify workspaceUserId is calculated correctly
# Check message.controller.js imports getWorkspaceConfig

grep "getWorkspaceConfig" backend/src/controllers/message.controller.js
```

### Issue: Topic constraints not working

**Check:**

```bash
# Verify topics added via Settings or API
curl -X POST http://localhost:7474/api/workspace/allowed-topics/get \
  -H "Authorization: YOUR_TOKEN"

# Should return topics array

# Check isTopicAllowed function in ai-functions.js
# Test with message that matches/doesn't match topic keywords
```

### Issue: RAG not applying config settings

**Check:**

```bash
# Verify ragConfig passed to findReleventDataFromVectorDB
# Check backend logs show maxRetrievedDocuments and similarityThreshold

# Look in ai-functions.js:
# Line: const maxResults = ragConfig?.maxRetrievedDocuments || 5
# This should use workspace setting
```

---

## 📊 Data Verification

### Check Workspace Created

```bash
# In MongoDB
use ai-agent
db.workspaces.find({ userId: "your_user_id" })

# Should show:
{
  "_id": ObjectId(...),
  "userId": "...",
  "workspaceName": "...",
  "aiConfig": {...},
  "ragConfig": {...},
  "globalAllowedTopics": [],
  "globalBlockedTopics": [],
  ...
}
```

### Check Topic Added

```bash
db.workspaces.findOne({ userId: "your_user_id" })
db.workspaces.findOne({...}).globalAllowedTopics

# Should show array of topics with structure:
{
  "_id": ObjectId(...),
  "topic": "Billing",
  "description": "...",
  "keywords": ["bill", "invoice"]
}
```

---

## 📈 Performance Testing

### Response Time Benchmarks

```
Normal Setup:
├─ Workspace get: ~50ms
├─ Embedding generation: ~200ms
├─ Vector search: ~50ms
├─ AI response: ~1000ms
└─ Total: ~1.3s

With Topic Checking:
└─ Add: ~5-10ms

With RAG Filtering:
├─ 5 docs to 3 docs: +0ms
└─ Apply threshold: ~10ms
```

### Test under load:

```bash
# Using Apache Bench
ab -n 100 -c 10 http://localhost:7474/api/workspace/get

# Monitor:
# - Response times
# - Error rates
# - Memory usage
```

---

## 🎯 Integration Testing

### Full Flow Test

```
1. User registers/logs in ✓
2. Navigate to Settings ✓
3. Update workspace name ✓
4. Save AI config ✓
5. Add allowed topics ✓
6. Add blocked topics ✓
7. Upload knowledge ✓
8. Create chatbot ✓
9. Send message ✓
10. Verify response respects config ✓
```

### Message Flow Test

```javascript
// Simulate user message flow
const message = "How can I return my order?";

// Step 1: Check topic
// "return" matches allowed topic "Returns" ✓

// Step 2: Retrieve context
// Get 5 documents from ChromaDB matching "return" ✓

// Step 3: Generate response
// Using tone: "friendly", temperature: 0.7 ✓

// Step 4: Verify
// Response should be friendly, 300-500 tokens ✓
```

---

## ✨ Feature Testing Matrix

| Feature              | Test                        | Expected           | Result |
| -------------------- | --------------------------- | ------------------ | ------ |
| Workspace Get        | POST /get                   | workspace data     | ✓/✗    |
| Workspace Update     | POST /update                | updated data       | ✓/✗    |
| AI Config Get        | POST /ai-config/get         | aiConfig           | ✓/✗    |
| AI Config Update     | POST /ai-config/update      | saved config       | ✓/✗    |
| RAG Config Get       | POST /rag-config/get        | ragConfig          | ✓/✗    |
| RAG Config Update    | POST /rag-config/update     | saved config       | ✓/✗    |
| Add Allowed Topic    | POST /allowed-topics/add    | topic added        | ✓/✗    |
| Get Allowed Topics   | POST /allowed-topics/get    | topics list        | ✓/✗    |
| Remove Allowed Topic | POST /allowed-topics/remove | topic removed      | ✓/✗    |
| Add Blocked Topic    | POST /blocked-topics/add    | topic added        | ✓/✗    |
| Get Blocked Topics   | POST /blocked-topics/get    | topics list        | ✓/✗    |
| Remove Blocked Topic | POST /blocked-topics/remove | topic removed      | ✓/✗    |
| Workspace Tab UI     | Load settings               | form loads         | ✓/✗    |
| AI Config Tab UI     | Load settings               | sliders work       | ✓/✗    |
| RAG Config Tab UI    | Load settings               | controls work      | ✓/✗    |
| Topics Tab UI        | Load settings               | add/remove works   | ✓/✗    |
| Topic Enforcement    | Send message                | topics checked     | ✓/✗    |
| RAG Application      | Send message                | config used        | ✓/✗    |
| AI Config Applied    | Send message                | settings respected | ✓/✗    |

---

## 🚨 Troubleshooting Common Issues

### Issue: "Workspace not found" error

```bash
# Solution: Create workspace first
POST /api/workspace/get
# This auto-creates workspace if not exists
```

### Issue: Settings not saving

```bash
# Check 1: Authentication
# Verify token is valid and user is logged in

# Check 2: Request format
# Ensure Content-Type: application/json

# Check 3: CORS
# Check browser console for CORS errors

# Check 4: Server logs
# Look for error messages in backend console
```

### Issue: Topics not being enforced

```bash
# Check 1: Topics added
curl -X POST http://localhost:7474/api/workspace/allowed-topics/get \
  -H "Authorization: TOKEN"
# Verify topics exist

# Check 2: Keywords match
# Ensure message contains keyword substring

# Check 3: Logic flow
# Add console.log in isTopicAllowed() function
# Verify it's called during message processing
```

### Issue: RAG not retrieving documents

```bash
# Check 1: Knowledge uploaded
# Verify documents in knowledge base

# Check 2: Embeddings exist
# Check ChromaDB has embeddings stored

# Check 3: Config settings
# Verify maxRetrievedDocuments > 0
# Verify similarityThreshold is reasonable

# Check 4: Query embeddings
# Verify message embeddings generated
```

---

## 📋 Pre-Launch Checklist

Before going to production:

- [ ] All endpoints tested and working
- [ ] Frontend UI fully functional
- [ ] Database indexes created
- [ ] Error handling implemented
- [ ] Logging in place
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Authentication verified
- [ ] Workspace isolation verified
- [ ] Topic constraints working
- [ ] RAG pipeline optimized
- [ ] AI responses quality tested
- [ ] Documentation complete
- [ ] Backup strategy in place
- [ ] Monitoring alerts set up

---

## 🎓 Learning Verification

Can you answer these questions?

1. **Architecture**: What components make up the workspace system?
   - Answer: Schema, Controller, Routes, AI Functions, Frontend UI

2. **Data Flow**: How does workspace config reach the AI?
   - Answer: Message → Controller → getWorkspaceConfig() → Pass to AI functions

3. **Topic Matching**: How are blocked topics checked?
   - Answer: isTopicAllowed() function checks keywords substring match

4. **RAG Integration**: How does RAG config improve retrieval?
   - Answer: similarityThreshold filters results, maxRetrievedDocuments limits output

5. **Frontend**: Where is workspace config updated?
   - Answer: Settings.jsx with tabs for Workspace, AI, RAG, Topics

---

## 📞 Quick Support Commands

```bash
# Check if backend running
curl http://localhost:7474

# Check if frontend running
curl http://localhost:5173

# Test workspace endpoint
curl -X POST http://localhost:7474/api/workspace/get \
  -H "Authorization: YOUR_TOKEN"

# View backend logs
tail -f backend_logs.txt

# Check MongoDB connection
mongo < check_db.js

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Settings page loads without errors
2. ✅ All tabs are functional
3. ✅ Workspace config saves successfully
4. ✅ API endpoints return correct data
5. ✅ Messages respect workspace settings
6. ✅ Topic constraints are enforced
7. ✅ RAG configuration is applied
8. ✅ AI responses match configured tone
9. ✅ Conversation history is used correctly
10. ✅ Token limits are respected

---

Congratulations! Your workspace and RAG implementation is complete and verified! 🚀
