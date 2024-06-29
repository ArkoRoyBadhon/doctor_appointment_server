"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patient_controller_1 = require("../../controllers/patient.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/p/create", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("patient"), patient_controller_1.createPatientController);
router.get("/p/get/all", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), patient_controller_1.getAllPatientsController);
router.get("/p/get/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), patient_controller_1.getPatientByIdController);
router.patch("/p/update/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), patient_controller_1.updatePatientController);
router.delete("/p/delete/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), patient_controller_1.deletePatientController);
exports.default = router;
