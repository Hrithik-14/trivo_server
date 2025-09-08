import express from "express";
import { 
  getAlerts, 
  getBirthdayAlerts, 
  checkYearlyCompletion, 
  markAlertAsRead, 
} from "../controllers/alertController";

let router = express.Router();

router.get("/alerts/:userId", getAlerts);
router.put("/alerts/:userId/:alertId/read", markAlertAsRead);
router.post("/alerts/birthday", getBirthdayAlerts);
router.post("/alerts/yearly", checkYearlyCompletion);

export default router;
