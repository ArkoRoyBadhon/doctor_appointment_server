import express from "express";

import { createDoctorController, deleteDoctorController, getAllDoctorsController, getDoctorByIdController, updateDoctorController } from "../../controllers/doctor.controller";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

router.post("/d/create", isAuthenticatedUser, authorizeRoles("admin"), createDoctorController);
router.get("/d/get/all", isAuthenticatedUser, authorizeRoles("admin"), getAllDoctorsController)
router.get("/d/get/:id", isAuthenticatedUser, authorizeRoles("admin", "doctor"), getDoctorByIdController)
router.patch("/d/update/:id", isAuthenticatedUser, authorizeRoles("admin", "doctor"), updateDoctorController);
router.delete("/d/delete/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteDoctorController);

export default router;
