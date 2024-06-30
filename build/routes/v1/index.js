"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const appointment_route_1 = __importDefault(require("../v1/appointment.route"));
const auth_route_1 = __importDefault(require("../v1/auth.route"));
const billing_route_1 = __importDefault(require("../v1/billing.route"));
const doctor_route_1 = __importDefault(require("../v1/doctor.route"));
const fileupload_route_1 = __importDefault(require("../v1/fileupload.route"));
const patient_route_1 = __importDefault(require("../v1/patient.route"));
const reviews_route_1 = __importDefault(require("../v1/reviews.route"));
const specialization_route_1 = __importDefault(require("./specialization.route"));
const payment_route_1 = __importDefault(require("./payment.route"));
router.use("/auth", auth_route_1.default);
router.use("/doctor", doctor_route_1.default);
router.use("/patient", patient_route_1.default);
router.use("/appointment", appointment_route_1.default);
router.use("/billing", billing_route_1.default);
router.use("/review", reviews_route_1.default);
router.use("/file", fileupload_route_1.default);
router.use("/specialization", specialization_route_1.default);
router.use("/payment", payment_route_1.default);
exports.default = router;
