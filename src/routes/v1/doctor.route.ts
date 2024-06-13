import express from "express";

import { createDoctorController, deleteDoctorController, getAllDoctorsController, getDoctorByIdController, updateDoctorController } from "../../controllers/doctor.controller";
import { isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

router.post("/d/create", isAuthenticatedUser, createDoctorController);
router.get("/d/get/all", getAllDoctorsController)
router.get("/d/get/:id", getDoctorByIdController)
router.patch("/d/update/:id", updateDoctorController);
router.delete("/d/delete/:id", deleteDoctorController);

export default router;
