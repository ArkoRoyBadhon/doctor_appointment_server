"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../../controllers/review.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/r/create", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), review_controller_1.createReviewController);
router.get("/r/get/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), review_controller_1.getReviewsForDoctorController);
// router.get("/r/get/:id", getPatientByIdController)
// router.patch("/r/update/:id", updatePatientController);
router.delete("/r/delete/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), review_controller_1.deleteReviewController);
exports.default = router;
