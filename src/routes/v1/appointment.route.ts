import express from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  getAllAppointmentsByDoctorController,
  getAllAppointmentsByUserController,
  updateAppointmentController,
} from "../../controllers/appointment.controller";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

router.post(
  "/create",
  isAuthenticatedUser,
  authorizeRoles("admin", "patient"),
  createAppointmentController
);
router.get(
  "/all",
  isAuthenticatedUser,
  authorizeRoles("admin", "doctor"),
  getAllAppointmentsController
);
router.get(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin", "patient", "doctor"),
  getAppointmentByIdController
);
router.put(
  "/update/:id",
  isAuthenticatedUser,
  authorizeRoles("admin", "patient"),
  updateAppointmentController
);
router.delete(
  "/delete/:id",
  isAuthenticatedUser,
  authorizeRoles("admin", "patient"),
  deleteAppointmentController
);
router.get(
  "/doctor/appointments",
  isAuthenticatedUser,
  authorizeRoles("doctor"),
  getAllAppointmentsByDoctorController
);
router.get(
  "/patient/appointments",
  isAuthenticatedUser,
  authorizeRoles("patient"),
  getAllAppointmentsByUserController
);

export default router;
