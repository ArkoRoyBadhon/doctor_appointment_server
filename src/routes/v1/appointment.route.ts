import express from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
} from "../../controllers/appointment.controller";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

router.post("/a/create", isAuthenticatedUser, authorizeRoles("admin", "patient"), createAppointmentController);
router.get("/a/get/all", isAuthenticatedUser, getAllAppointmentsController);
router.get("/a/get/:id",  getAppointmentByIdController);
router.put("/a/update/:id", isAuthenticatedUser, authorizeRoles("admin", "patient"), updateAppointmentController);
router.delete("/a/delete/:id", isAuthenticatedUser, authorizeRoles("admin", "patient"), deleteAppointmentController);

export default router;
