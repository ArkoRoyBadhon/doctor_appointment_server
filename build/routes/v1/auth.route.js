"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.registerCustomerController);
router.get("/auth-state", auth_1.isAuthenticatedUser, auth_controller_1.getAuthState);
router.patch("/auth-state/update", auth_1.isAuthenticatedUser, auth_controller_1.updateUserController);
router.post("/register-doctor", auth_controller_1.registerDoctorController);
router.post("/recover-password", auth_controller_1.recoverPassword);
router.post("/login", auth_controller_1.signinController);
router.post("/refresh-token", auth_controller_1.getAccessToken);
exports.default = router;
