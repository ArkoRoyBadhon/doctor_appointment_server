import express from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  getallAppointmentByDoctor,
  getallAppointmentByUser,
  updateAppointmentController,
} from "../../controllers/appointment.controller";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

router.post("/a/create", isAuthenticatedUser, authorizeRoles("admin", "patient"), createAppointmentController);
router.get("/a/get/all", isAuthenticatedUser, getAllAppointmentsController);
router.get("/a/get/:id",  getAppointmentByIdController);
router.put("/a/update/:id", isAuthenticatedUser, authorizeRoles("admin", "patient"), updateAppointmentController);
router.delete("/a/delete/:id", isAuthenticatedUser, authorizeRoles("admin", "patient"), deleteAppointmentController);
router.get("/a/doctor/appointments",isAuthenticatedUser,authorizeRoles("doctor"),getallAppointmentByDoctor)
router.get("/a/patient/get",
  // isAuthenticatedUser,authorizeRoles("patient"),
  getallAppointmentByUser)

export default router;
