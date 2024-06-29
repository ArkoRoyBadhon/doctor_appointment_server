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
exports.deletePatientController = exports.updatePatientController = exports.getPatientByIdController = exports.getAllPatientsController = exports.createPatientController = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const express_validator_1 = require("express-validator");
const patient_model_1 = __importDefault(require("../models/patient.model"));
const appointment_model_1 = __importDefault(require("../models/appointment.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
exports.createPatientController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    const userId = req.user;
    if (!userId) {
        return res.status(422).json({
            errors: "Something went wrong",
        });
    }
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            errors: firstError,
        });
    }
    const { name, age, gender, phone, email } = req.body;
    try {
        const existingPatient = yield patient_model_1.default.findOne({ email });
        if (existingPatient) {
            return res
                .status(400)
                .json({ message: "Patient with this email already exists" });
        }
        const newPatient = yield patient_model_1.default.create({
            name,
            age,
            gender,
            phone,
            email,
            userId: userId === null || userId === void 0 ? void 0 : userId._id
        });
        res.status(201).json(newPatient);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating patient", error });
    }
}));
exports.getAllPatientsController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield patient_model_1.default.find();
        return res.status(200).json({
            success: true,
            msg: "Patients have been retrieved successfully.",
            patients,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error retrieving patients.", error });
    }
}));
exports.getPatientByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const patient = yield patient_model_1.default.findById(id).populate("reviews");
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.status(200).json({
            success: true,
            msg: "Patient retrieved successfully.",
            patient,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error retrieving patient.", error });
    }
}));
exports.updatePatientController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            errors: firstError,
        });
    }
    const { id } = req.params;
    const { name, age, gender, phone, email } = req.body;
    try {
        const patient = yield patient_model_1.default.findById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        patient.name = name || patient.name;
        patient.age = age || patient.age;
        patient.gender = gender || patient.gender;
        patient.phone = phone || patient.phone;
        patient.email = email || patient.email;
        yield patient.save();
        const UserUpdate = yield user_model_1.default.findByIdAndUpdate(patient === null || patient === void 0 ? void 0 : patient.userId, Object.assign({}, req.body), {
            new: true,
        });
        return res.status(200).json({
            success: true,
            msg: "Patient updated successfully.",
            patient,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error updating patient.", error });
    }
}));
exports.deletePatientController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const patient = yield patient_model_1.default.findByIdAndDelete(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        yield appointment_model_1.default.updateMany({ patient: patient._id, status: { $ne: "completed" } }, { status: "canceled" });
        yield user_model_1.default.findByIdAndDelete(patient === null || patient === void 0 ? void 0 : patient.userId);
        return res.status(200).json({
            success: true,
            msg: "Patient deleted successfully.",
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error deleting patient.", error });
    }
}));
