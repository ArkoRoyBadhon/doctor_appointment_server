import express from "express";

import {
  getAccessToken,
  recoverPassword,
  registerCustomerController,
  signinController,
} from "../../controllers/auth.controller";
const router = express.Router();

router.post("/register", registerCustomerController);
router.post("/recover-password", recoverPassword);
router.post("/login", signinController);
router.post("/refresh-token", getAccessToken);

export default router;
