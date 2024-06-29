import express from "express";
const router = express.Router();

import appointment from "../v1/appointment.route";
import auth from "../v1/auth.route";
import billing from "../v1/billing.route";
import doctor from "../v1/doctor.route";
import file from "../v1/fileupload.route";
import patient from "../v1/patient.route";
import review from "../v1/reviews.route";
import specializationRoute from "./specialization.route";

router.use("/auth", auth);
router.use("/doctor", doctor);
router.use("/patient", patient);
router.use("/appointment", appointment);
router.use("/billing", billing);
router.use("/review", review);
router.use("file", file);
router.use("/specialization", specializationRoute);

export default router;
