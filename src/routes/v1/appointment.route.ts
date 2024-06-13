import express from "express";
import {
  createAppointmentController,
  deleteAppointmentController,
  getAllAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
} from "../../controllers/appointment.controller";
const router = express.Router();

router.post("/a/create", createAppointmentController);
router.get("/a/get/all", getAllAppointmentsController);
router.get("/a/get/:id", getAppointmentByIdController);
router.put("/a/update/:id", updateAppointmentController);
router.delete("/a/delete/:id", deleteAppointmentController);

export default router;
