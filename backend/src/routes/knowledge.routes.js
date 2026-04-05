import express from 'express'
import { addKnowledge, deleteKnowledge, getAllKnowledge, updateKnowledge } from '../controllers/knowledge.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { isSubscribed } from '../middleware/isSubscribed.middleware.js'
import { upload } from '../middleware/multer.middleware.js'

const knowledgeRoutes = express.Router()

knowledgeRoutes.post("/add-knowledge",authMiddleware,upload.single('file'),isSubscribed,addKnowledge)
knowledgeRoutes.post("/get-all",authMiddleware,getAllKnowledge)
knowledgeRoutes.post("/delete",authMiddleware,deleteKnowledge)
knowledgeRoutes.post("/update",authMiddleware,updateKnowledge)

export default knowledgeRoutes