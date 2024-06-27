import express from "express";

import {
  getAccessToken,
  recoverPassword,
  registerCustomerController,
  registerDoctorController,
  signinController,
} from "../../controllers/auth.controller";
const router = express.Router();

router.post("/register", registerCustomerController);
router.post("/register-doctor", registerDoctorController);
router.post("/recover-password", recoverPassword);
router.post("/login", signinController);
router.post("/refresh-token", getAccessToken);

export default router;
