import express from "express";

import {
  checkEmailController,
  registerCustomerController,
  signinController,
} from "../../controllers/auth.controller";
const router = express.Router();

router.post("/u/exist", checkEmailController);

router.post("/register", registerCustomerController);

router.post("/login", signinController);

export default router;
