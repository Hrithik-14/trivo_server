import express from 'express';
import { checkYearlyCompletion, getAlerts, getBirthdayAlerts, markAlertAsRead } from '../controllers/alertController';


let router = express.Router()

router.get("/alerts/:userId", getAlerts);
router.put("/alerts/:userId/:alertId/read", markAlertAsRead);
router.post("/alerts/birthday", getBirthdayAlerts);
router.post("/alerts/check-yearly-completion",checkYearlyCompletion)


export default router