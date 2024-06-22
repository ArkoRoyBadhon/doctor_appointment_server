import express from "express";
import { createPatientController, deletePatientController, getAllPatientsController, getPatientByIdController, updatePatientController } from "../../controllers/patient.controller";
import { getAppointmentByIdController } from "../../controllers/appointment.controller";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();


router.post("/p/create", isAuthenticatedUser, authorizeRoles("patient"), createPatientController);
router.get("/p/get/all", isAuthenticatedUser, authorizeRoles("admin"), getAllPatientsController)
router.get("/p/get/:id", isAuthenticatedUser, authorizeRoles("admin", "patient"), getPatientByIdController)
router.patch("/p/update/:id", isAuthenticatedUser, authorizeRoles("admin", "patient"), updatePatientController);
router.delete("/p/delete/:id", isAuthenticatedUser, authorizeRoles("admin"), deletePatientController);

export default router;