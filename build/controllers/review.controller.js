"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewController = exports.getReviewsForDoctorController = exports.createReviewController = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const express_validator_1 = require("express-validator");
const review_model_1 = __importDefault(require("../models/review.model"));
const appointment_model_1 = __importDefault(require("../models/appointment.model"));
const doctor_model_1 = __importDefault(require("../models/doctor.model"));
exports.createReviewController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            errors: firstError,
        });
    }
    const { patient, doctor, rating, comment, appointment } = req.body;
    try {
        const existingAppointment = yield appointment_model_1.default.findById(appointment);
        if (!existingAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if (existingAppointment.patient.toString() !== patient) {
            return res.status(400).json({
                message: "The appointment does not belong to the patient",
            });
        }
        // Create the review
        const newReview = yield review_model_1.default.create({
            patient,
            doctor,
            rating,
            comment,
            appointment,
        });
        res.status(201).json(newReview);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating review", error });
    }
}));
exports.getReviewsForDoctorController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const doctor = yield doctor_model_1.default.findById(id).populate("reviews");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        return res.status(200).json({
            success: true,
            reviews: doctor.reviews,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error retrieving reviews.", error });
    }
}));
exports.deleteReviewController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const review = yield review_model_1.default.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        // await Doctor.findByIdAndUpdate(
        //   review.doctor,
        //   { $pull: { reviews: review._id } },
        //   { new: true }
        // );
        // await Patient.findByIdAndUpdate(
        //   review.patient,
        //   { $pull: { reviews: review._id } },
        //   { new: true }
        // );
        return res.status(200).json({
            success: true,
            msg: "Review deleted successfully.",
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error deleting review.", error });
    }
}));
