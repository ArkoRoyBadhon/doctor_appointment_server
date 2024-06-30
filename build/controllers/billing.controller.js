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
exports.deleteBillingController = exports.updateBillingController = exports.getBillingByIdController = exports.getAllBillingByUserController = exports.getAllBillingController = exports.createBillingController = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const express_validator_1 = require("express-validator");
const billing_model_1 = __importDefault(require("../models/billing.model"));
const appointment_model_1 = __importDefault(require("../models/appointment.model"));
exports.createBillingController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            errors: firstError,
        });
    }
    const { appointment, patient, doctor, amount, status } = req.body;
    // appointment, patient, doctor, amount, status, date 
    console.log(appointment);
    try {
        const existingAppointment = yield appointment_model_1.default.findById(appointment);
        if (!existingAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if (existingAppointment.patient.toString() !== patient) {
            return res.status(400).json({
                message: "The patient does not match the appointment's patient",
            });
        }
        const existingBilling = yield billing_model_1.default.findOne({
            appointment: appointment,
        });
        if (existingAppointment.status === "completed" &&
            (existingBilling === null || existingBilling === void 0 ? void 0 : existingBilling.status) === "paid") {
            return res
                .status(400)
                .json({ message: "Appointment & billing already completed and paid" });
        }
        const newBilling = yield billing_model_1.default.create({
            appointment,
            patient,
            doctor,
            amount,
            status,
        });
        if (newBilling) {
            yield appointment_model_1.default.findByIdAndUpdate(appointment, { status: "completed" }, { new: true });
        }
        res.status(201).json(newBilling);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating billing record", error });
    }
}));
exports.getAllBillingController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const billingRecords = yield billing_model_1.default.find()
            .populate("patient", "name email")
            .populate("doctor", "name specialization");
        return res.status(200).json({
            success: true,
            msg: "Billing records have been retrieved successfully.",
            billingRecords,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error retrieving billing records.",
            error,
        });
    }
}));
exports.getAllBillingByUserController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.status(500).json("user not found");
    }
    try {
        const billingRecords = yield billing_model_1.default.findById(user.userId)
            .populate("patient", "name email")
            .populate("doctor", "name specialization");
        return res.status(200).json({
            success: true,
            msg: "Billing records have been retrieved successfully.",
            billingRecords,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error retrieving billing records.",
            error,
        });
    }
}));
exports.getBillingByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const billing = yield billing_model_1.default.findById(id)
            .populate("appointment", "date time")
            .populate("patient", "name");
        if (!billing) {
            return res.status(404).json({ message: "Billing record not found" });
        }
        return res.status(200).json({
            success: true,
            msg: "Billing record retrieved successfully.",
            billing,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error retrieving billing record.",
            error,
        });
    }
}));
exports.updateBillingController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            errors: firstError,
        });
    }
    const { id } = req.params;
    const { appointment, amount, status } = req.body;
    try {
        const billing = yield billing_model_1.default.findById(id);
        if (!billing) {
            return res.status(404).json({ message: "Billing record not found" });
        }
        billing.appointment = appointment || billing.appointment;
        billing.amount = amount || billing.amount;
        billing.status = status || billing.status;
        yield billing.save();
        return res.status(200).json({
            success: true,
            msg: "Billing record updated successfully.",
            billing,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error updating billing record.", error });
    }
}));
exports.deleteBillingController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const billing = yield billing_model_1.default.findByIdAndDelete(id);
        if (!billing) {
            return res.status(404).json({ message: "Billing record not found" });
        }
        return res.status(200).json({
            success: true,
            msg: "Billing record deleted successfully.",
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error deleting billing record.", error });
    }
}));
