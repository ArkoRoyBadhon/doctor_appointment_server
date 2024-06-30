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
exports.getAllAppointmentsByUserController = exports.getAllAppointmentsByDoctorController = exports.deleteAppointmentController = exports.updateAppointmentController = exports.getAppointmentByIdController = exports.getAllAppointmentsController = exports.createAppointmentController = void 0;
const express_validator_1 = require("express-validator");
const QueryBuilder_1 = __importDefault(require("../builder/QueryBuilder"));
const getNextDate_1 = __importDefault(require("../helpers/getNextDate"));
const slotAvailability_1 = __importDefault(require("../helpers/slotAvailability"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const doctor_model_1 = __importDefault(require("../models/doctor.model"));
const patient_model_1 = __importDefault(require("../models/patient.model"));
const appointment_model_1 = __importDefault(require("../models/appointment.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const doctor_model_2 = __importDefault(require("../models/doctor.model"));
exports.createAppointmentController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            errors: firstError,
        });
    }
    const { doctor, patient, description, dayOfWeek, startTime, endTime, status, } = req.body;
    try {
        const existDoctor = yield doctor_model_1.default.findById(doctor);
        const existPatient = yield patient_model_1.default.findById(patient);
        if (!existDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        if (!existPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const nextDate = (0, getNextDate_1.default)(dayOfWeek);
        // Check slot availability
        const availabilityCheck = yield (0, slotAvailability_1.default)(doctor, nextDate, startTime, endTime);
        if (!availabilityCheck.available) {
            return res.status(400).json({ message: availabilityCheck.message });
        }
        const dayAvailability = existDoctor.availability.find((avail) => avail.day === dayOfWeek);
        if (!dayAvailability) {
            return res
                .status(400)
                .json({ message: `Doctor is not available on ${dayOfWeek}` });
        }
        // Check maxPatient limit
        const appointmentsCount = yield appointment_model_1.default.countDocuments({
            doctor,
            date: nextDate,
        });
        console.log("count ", appointmentsCount);
        console.log("count day", dayAvailability);
        console.log("pick date", nextDate);
        if (appointmentsCount >= dayAvailability.maxPatient) {
            return res
                .status(400)
                .json({ message: "Max patients limit exceeded for the day" });
        }
        const newAppointment = yield appointment_model_1.default.create({
            doctor,
            patient,
            description,
            date: nextDate,
            startTime,
            endTime,
            status: "scheduled",
        });
        res.status(201).json(newAppointment);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating appointment", error });
    }
}));
exports.getAllAppointmentsController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield appointment_model_1.default.find()
            .populate("doctor", "name specialization")
            .populate("patient", "name email");
        return res.status(200).json({
            success: true,
            msg: "Appointments have been retrieved successfully.",
            appointments,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error retrieving appointments.",
            error,
        });
    }
}));
exports.getAppointmentByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const appointment = yield appointment_model_1.default.findById(id)
            .populate("doctor", "name specialization")
            .populate("patient", "name email");
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.status(200).json({
            success: true,
            msg: "Appointment retrieved successfully.",
            appointment,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error retrieving appointment.",
            error,
        });
    }
}));
exports.updateAppointmentController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            errors: firstError,
        });
    }
    const { id } = req.params;
    const { doctor, patient, date, startTime, endTime, status } = req.body;
    try {
        const appointment = yield appointment_model_1.default.findById(id);
        if (!appointment) {
            return res.status(400).json({ message: "Appointment not found" });
        }
        const info = {
            doctor: doctor || appointment.doctor,
            patient: patient || appointment.patient,
            date: date || appointment.date,
            startTime: startTime || appointment.startTime,
            endTime: endTime || appointment.endTime,
            status: status || appointment.status,
        };
        console.log("prev", appointment);
        // await appointment.save();
        const result = yield appointment_model_1.default.findByIdAndUpdate(id, info, {
            new: true,
        });
        return res.status(200).json({
            success: true,
            msg: "Appointment updated successfully.",
            result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error updating appointment.",
            error,
        });
    }
}));
exports.deleteAppointmentController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const appointment = yield appointment_model_1.default.findByIdAndDelete(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        return res.status(200).json({
            success: true,
            msg: "Appointment deleted successfully.",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error deleting appointment.",
            error,
        });
    }
}));
exports.getAllAppointmentsByDoctorController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const existUser = yield user_model_1.default.findById(user._id);
        if (!existUser) {
            return res.status(400).json({ message: "User not found" });
        }
        const existDoctor = yield doctor_model_2.default.findOne({
            email: existUser.email,
        });
        if (!existDoctor) {
            return res.status(400).json({ message: "Doctor not found" });
        }
        const query = appointment_model_1.default.find({ doctor: existDoctor._id })
            .populate("doctor", "name specialization")
            .populate("patient", "name email");
        const appointmentsQuery = new QueryBuilder_1.default(query, req.query)
            .filter()
            .paginate();
        const appointments = yield appointmentsQuery.modelQuery;
        return res.status(200).json({
            success: true,
            msg: "Appointments have been retrieved successfully.",
            appointments,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error retrieving appointments.",
            error: error,
        });
    }
}));
exports.getAllAppointmentsByUserController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        // console.log("user iddd", user);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const existUser = yield user_model_1.default.findById(user._id);
        if (!existUser) {
            return res.status(400).json({ message: "User not found" });
        }
        const existPatient = yield patient_model_1.default.findOne({
            email: existUser.email,
        });
        if (!existPatient) {
            return res.status(400).json({ message: "Patient not found" });
        }
        const query = appointment_model_1.default.find({ patient: existPatient._id })
            .populate("doctor", "name specialization")
            .populate("patient", "name email");
        const appointmentsQuery = new QueryBuilder_1.default(query, req.query)
            .filter()
            .paginate();
        const appointments = yield appointmentsQuery.modelQuery;
        return res.status(200).json({
            success: true,
            msg: "Appointments have been retrieved successfully.",
            appointments,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error retrieving appointments.",
            error: error,
        });
    }
}));
