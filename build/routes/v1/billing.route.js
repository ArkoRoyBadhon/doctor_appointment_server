"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billing_controller_1 = require("../../controllers/billing.controller");
const auth_1 = require("../../middlewares/auth");
const router = express_1.default.Router();
router.post("/b/create", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), billing_controller_1.createBillingController);
router.get("/b/get/all", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), billing_controller_1.getAllBillingController);
router.get("/b/get/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin", "patient"), billing_controller_1.getBillingByIdController);
router.patch("/b/update/:id", billing_controller_1.updateBillingController);
router.delete("/b/delete/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), billing_controller_1.deleteBillingController);
exports.default = router;
