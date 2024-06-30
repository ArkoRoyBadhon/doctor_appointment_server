"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointment_controller_1 = require("../../controllers/appointment.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), appointment_controller_1.createAppointmentController);
router.get("/all", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "doctor"), appointment_controller_1.getAllAppointmentsController);
router.get("/get/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient", "doctor"), appointment_controller_1.getAppointmentByIdController);
router.patch("/update/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), appointment_controller_1.updateAppointmentController);
router.delete("/delete/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), appointment_controller_1.deleteAppointmentController);
router.get("/doctor/appointments", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("doctor"), appointment_controller_1.getAllAppointmentsByDoctorController);
router.get("/a/patient/get", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("patient"), appointment_controller_1.getAllAppointmentsByUserController);
exports.default = router;
