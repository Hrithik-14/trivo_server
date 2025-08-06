import express from "express";
import { errorHandling } from "../helper/errorMiddleware";
import { searchProject, searchUsers } from "../controllers/search";

const router = express.Router();

router.get("/search", errorHandling(searchUsers))
.get('/projectSearch', errorHandling(searchProject))
export default router;
