import express from "express";
const router = express.Router();

import doctor from "../v1/doctor.route"
import patient from "../v1/patient.route"
import appointment from "../v1/appointment.route"
import billing from "../v1/billing.route"
import review from "../v1/reviews.route"



router.use("/doctor", doctor);
router.use("/patient", patient);
router.use("/appointment", appointment);
router.use("/billing", billing);
router.use("/review", review);



export default router;