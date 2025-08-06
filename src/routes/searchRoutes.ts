import express from 'express'
import { errorHandling } from '../helper/errorMiddleware'
import { searchUsers } from '../controllers/search'

const router = express.Router()

router.get('/search', errorHandling(searchUsers))

export default router