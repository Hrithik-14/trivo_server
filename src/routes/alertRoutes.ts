import express from "express";
import { 
  getAlerts, 
  getBirthdayAlerts, 
  checkYearlyCompletion, 
  markAlertAsRead, 
  getTodayBirthdays,
  getTodayYearlyAlerts
} from "../controllers/alertController";

let router = express.Router();

router.get("/alerts/:userId", getAlerts);
router.put("/alerts/:userId/:alertId/read", markAlertAsRead);
router.post("/alerts/birthday", getBirthdayAlerts);
router.post("/alerts/yearly", checkYearlyCompletion);
router.get("/alerts/birthday/today", getTodayBirthdays);
router.get("/alerts/yearly/today", getTodayYearlyAlerts);


export default router;
