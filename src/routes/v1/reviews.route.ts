import express from "express";
import { createReviewController, deleteReviewController, getReviewsForDoctorController } from "../../controllers/review.controller";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
const router = express.Router();


router.post("/r/create", isAuthenticatedUser, authorizeRoles("admin", "patient"), createReviewController);
router.get("/r/get/:id", isAuthenticatedUser, authorizeRoles("admin", "patient"), getReviewsForDoctorController)
// router.get("/r/get/:id", getPatientByIdController)
// router.patch("/r/update/:id", updatePatientController);
router.delete("/r/delete/:id", isAuthenticatedUser, authorizeRoles("admin", "patient"), deleteReviewController);

export default router;
