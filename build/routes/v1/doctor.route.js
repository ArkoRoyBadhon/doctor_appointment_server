"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctor_controller_1 = require("../../controllers/doctor.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/d/create", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), doctor_controller_1.createDoctorController);
router.get("/d/get/all", doctor_controller_1.getAllDoctorsController);
router.get("/d/get/:id", doctor_controller_1.getDoctorByIdController);
router.patch("/d/update/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "doctor"), doctor_controller_1.updateDoctorController);
router.delete("/d/delete/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), doctor_controller_1.deleteDoctorController);
exports.default = router;
