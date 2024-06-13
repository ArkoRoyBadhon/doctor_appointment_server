import express from "express";
import { createPatientController, deletePatientController, getAllPatientsController, getPatientByIdController, updatePatientController } from "../../controllers/patient.controller";
import { getAppointmentByIdController } from "../../controllers/appointment.controller";
const router = express.Router();


router.post("/p/create", createPatientController);
router.get("/p/get/all", getAllPatientsController)
router.get("/p/get/:id", getPatientByIdController)
router.patch("/p/update/:id", updatePatientController);
router.delete("/p/delete/:id", deletePatientController);

export default router;