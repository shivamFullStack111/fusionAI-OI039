import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { isSubscribed } from '../middleware/isSubscribed.middleware.js'
import { createSection, deleteSection, getAllSection, updateSection } from '../controllers/section.controller.js'

const  sectionRoutes = express.Router()

sectionRoutes.post("/create",authMiddleware,isSubscribed,createSection)
sectionRoutes.post("/get-all",authMiddleware,getAllSection)
sectionRoutes.post("/update",authMiddleware,updateSection)
sectionRoutes.post("/delete",authMiddleware,deleteSection)

export default sectionRoutes