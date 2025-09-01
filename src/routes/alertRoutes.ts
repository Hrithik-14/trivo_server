import express from 'express';
import { getAlerts, getBirthdayAlerts, markAlertAsRead } from '../controllers/alertController';


let router = express.Router()

router.get("/alerts/:userId", getAlerts);
router.put("/alerts/:userId/:alertId/read", markAlertAsRead);
router.post("/alerts/birthday", getBirthdayAlerts);


export default router