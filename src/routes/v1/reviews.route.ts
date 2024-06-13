import express from "express";
import { createReviewController, deleteReviewController, getReviewsForDoctorController } from "../../controllers/review.controller";
const router = express.Router();


router.post("/r/create", createReviewController);
router.get("/r/get/:id", getReviewsForDoctorController)
// router.get("/r/get/:id", getPatientByIdController)
// router.patch("/r/update/:id", updatePatientController);
router.delete("/r/delete/:id", deleteReviewController);

export default router;
