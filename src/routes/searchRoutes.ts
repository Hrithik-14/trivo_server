import express from "express";
import { errorHandling } from "../helper/errorMiddleware";
import { searchManagerProject, searchMangersEmployee, searchProject, searchUsers } from "../controllers/search";

const router = express.Router();

router.get("/search", errorHandling(searchUsers))
.get('/projectSearch', errorHandling(searchProject))
.get('/projectManagerSearch/:id', errorHandling(searchManagerProject))
.get('/:managerId/searchUsers', errorHandling(searchMangersEmployee))
export default router;
