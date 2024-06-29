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
exports.getallAppointmentByUser = exports.getallAppointmentByDoctor = exports.deleteAppointmentController = exports.updateAppointmentController = exports.getAppointmentByIdController = exports.getAllAppointmentsController = exports.createAppointmentController = void 0;
const express_validator_1 = require("express-validator");
const QueryBuilder_1 = __importDefault(require("../builder/QueryBuilder"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const appointment_model_1 = __importDefault(require("../models/appointment.model"));
const doctor_model_1 = __importDefault(require("../models/doctor.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const patient_model_1 = __importDefault(require("../models/patient.model"));
exports.createAppointmentController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return res.status(422).json({
            errors: firstError,
        });
    }
    const data = req.body;
    try {
        const existDoctor = yield doctor_model_1.default.findById(data === null || data === void 0 ? void 0 : data.doctor);
        if (!existDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        // const availabilityCheck = await checkSlotAvailability(data.doctor, new Date(data.date), data.time);
        // if (!availabilityCheck.available) {
        //   return res.status(400).json({ message: availabilityCheck.message });
        // }
        const newAppointment = yield appointment_model_1.default.create(data);
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
        return res
            .status(500)
            .json({ success: false, msg: "Error retrieving appointments.", error });
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
        return res
            .status(500)
            .json({ success: false, msg: "Error retrieving appointment.", error });
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
    const { doctor, patient, date, time, status } = req.body;
    try {
        const appointment = yield appointment_model_1.default.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        appointment.doctor = doctor || appointment.doctor;
        appointment.patient = patient || appointment.patient;
        appointment.date = date || appointment.date;
        appointment.time = time || appointment.time;
        appointment.status = status || appointment.status;
        yield appointment.save();
        return res.status(200).json({
            success: true,
            msg: "Appointment updated successfully.",
            appointment,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error updating appointment.", error });
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
        return res
            .status(500)
            .json({ success: false, msg: "Error deleting appointment.", error });
    }
}));
exports.getallAppointmentByDoctor = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user)
            return;
        const query = appointment_model_1.default.find({ doctor: user._id })
            .populate("doctor", "name specialization")
            .populate("patient", "name email");
        const appointmentsquery = new QueryBuilder_1.default(query, req.query)
            .filter()
            .paginate();
        const appointments = yield appointmentsquery.modelQuery;
        return res.status(200).json({
            success: true,
            msg: "Appointments have been retrieved successfully.",
            appointments,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error retrieving appointments.", error });
    }
}));
// export const getallAppointmentByUser = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = req.user;
//       console.log("userid mango", user);
//       // const user.userId = "667fa261c8fd7dfbd8e6b961";
//       if (!user) return;
//       const existUser = await User.findById(user?._id)
//       if(!existUser) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       const existPatient = await patientModel.find({email: existUser.email})
//       if(!existPatient) {
//         return res.status(404).json({ message: "Patient not found" });
//       }
//       console.log("aaaa", existPatient[0]);
//       const query = Appointment.find({ patient: existPatient[0]._id })
//         .populate("doctor", "name specialization")
//         .populate("patient", "name email");
//       const appointmentsquery = new QueryBuilder(query, req.query)
//         .filter()
//         .paginate();
//       const appointments = await appointmentsquery.modelQuery;
//       return res.status(200).json({
//         success: true,
//         msg: "Appointments have been retrieved successfully.",
//         appointments,
//       });
//     } catch (error) {
//       return res
//         .status(500)
//         .json({ success: false, msg: "Error retrieving appointments.", error });
//     }
//   }
// );
exports.getallAppointmentByUser = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            console.log("No user found in request");
            return res.status(401).json({ message: "Unauthorized access" });
        }
        console.log("user orange", user);
        const existUser = yield user_model_1.default.findById(user._id);
        if (!existUser) {
            console.log("User not found in database");
            return res.status(404).json({ message: "User not found" });
        }
        const existPatient = yield patient_model_1.default.findOne({ email: existUser.email });
        if (!existPatient) {
            console.log("Patient not found in database");
            return res.status(500).json({ message: "Patient not found" });
        }
        console.log("Patient found", existPatient);
        const query = appointment_model_1.default.find({ patient: existPatient._id })
            .populate("doctor", "name specialization")
            .populate("patient", "name email");
        const appointmentsQuery = new QueryBuilder_1.default(query, req.query).filter().paginate();
        const appointments = yield appointmentsQuery.modelQuery;
        console.log("Appointments retrieved", appointments);
        return res.status(200).json({
            success: true,
            msg: "Appointments have been retrieved successfully.",
            appointments,
        });
    }
    catch (error) {
        console.log("Error retrieving appointments", error);
        return res.status(500).json({
            success: false,
            msg: "Error retrieving appointments.",
            error: error,
        });
    }
}));
