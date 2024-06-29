import express from "express";

import {
  getAccessToken,
  getAuthState,
  recoverPassword,
  registerCustomerController,
  registerDoctorController,
  signinController,
} from "../../controllers/auth.controller";
import { isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();

router.post("/register", registerCustomerController);
router.get("/auth-state", isAuthenticatedUser, getAuthState);
router.post("/register-doctor", registerDoctorController);
router.post("/recover-password", recoverPassword);
router.post("/login", signinController);
router.post("/refresh-token", getAccessToken);

export default router;
