import express from "express";
import {
  createBillingController,
  deleteBillingController,
  getAllBillingController,
  getBillingByIdController,
  updateBillingController,
} from "../../controllers/billing.controller";

const router = express.Router();

router.post("/b/create", createBillingController);
router.get("/b/get/all", getAllBillingController);
router.get("/b/get/:id", getBillingByIdController);
router.put("/b/update/:id", updateBillingController);
router.delete("/b/delete/:id", deleteBillingController);

export default router;
