import express from "express";
import {
  createBillingController,
  deleteBillingController,
  getAllBillingByUserController,
  getAllBillingController,
  getBillingByIdController,
  updateBillingController,
} from "../../controllers/billing.controller";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";

const router = express.Router();

router.post("/b/create", isAuthenticatedUser, authorizeRoles("admin", "patient"), createBillingController);
router.get("/b/get/all", isAuthenticatedUser, authorizeRoles("admin"), getAllBillingController);
router.get("/b/get/user", isAuthenticatedUser, authorizeRoles("admin", "patient"), getAllBillingByUserController);
router.get("/b/get/:id", isAuthenticatedUser, authorizeRoles("admin", "patient"), getBillingByIdController);
router.patch("/b/update/:id", updateBillingController);
router.delete("/b/delete/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteBillingController);

export default router;
