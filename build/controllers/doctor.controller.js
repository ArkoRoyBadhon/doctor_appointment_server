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
exports.deleteDoctorController = exports.updateDoctorController = exports.getDoctorByIdController = exports.getAllDoctorsController = exports.createDoctorController = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const express_validator_1 = require("express-validator");
const doctor_model_1 = __importDefault(require("../models/doctor.model"));
const appointment_model_1 = __importDefault(require("../models/appointment.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.createDoctorController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    const user = req.user;
    if (!user) {
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
    const { name, specialization, phone, password, email, availability } = req.body;
    try {
        const existingDoctor = yield doctor_model_1.default.findOne({ email });
        if (existingDoctor) {
            return res
                .status(400)
                .json({ message: "Doctor with this email already exists" });
        }
        const newDoctor = yield doctor_model_1.default.create({
            name,
            specialization,
            phone,
            email,
            availability,
            userId: user._id,
        });
        // Check if a user with the same email already exists
        const existingEmail = yield user_model_1.default.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "This email is already used!" });
        }
        // const password = "12345678";
        // Validate password before hashing
        if (!password) {
            throw new Error("Password must be provided");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const userDoc = yield user_model_1.default.create({
            email,
            name,
            password: hashedPassword,
            role: "doctor",
        });
        res.status(201).json(newDoctor);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating doctor", error });
    }
}));
exports.getAllDoctorsController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, specialization, gender, minFee, maxFee, page = 1, limit = 6, } = req.query;
        const query = {};
        // Name filter
        if (name) {
            query.name = { $regex: name, $options: "i" };
        }
        // Specialization filter
        if (specialization) {
            if (mongoose_1.default.Types.ObjectId.isValid(specialization)) {
                query.specialization = new mongoose_1.default.Types.ObjectId(specialization);
            }
            else {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid specialization ID format.",
                });
            }
        }
        // Gender filter
        if (gender) {
            query.gender = gender;
        }
        // Fee filter
        if (minFee && maxFee) {
            query.fee = { $gte: Number(minFee), $lte: Number(maxFee) };
        }
        else if (minFee) {
            query.fee = { $gte: Number(minFee) };
        }
        else if (maxFee) {
            query.fee = { $lte: Number(maxFee) };
        }
        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        const doctors = yield doctor_model_1.default.find(query).skip(skip).limit(Number(limit));
        return res.status(200).json({
            success: true,
            msg: "Doctors have been retrieved successfully.",
            doctors,
            page: Number(page),
            limit: Number(limit),
            total: yield doctor_model_1.default.countDocuments(query),
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error retrieving doctors.", error });
    }
}));
exports.getDoctorByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // const doctor = await Doctor.findById(id).populate("reviews");
        const doctor = yield doctor_model_1.default.findById(id)
            .populate({
            path: 'reviews',
            populate: {
                path: 'patient',
                model: 'User',
            },
        });
        if (!doctor) {
            return res
                .status(404)
                .json({ success: false, message: "Doctor not found" });
        }
        console.log("revv,", doctor);
        return res.status(200).json({
            success: true,
            msg: "Doctor retrieved successfully.",
            doctor,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error retrieving doctor.", error });
    }
}));
exports.updateDoctorController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   const firstError = errors.array().map((error) => error.msg)[0];
    //   return res.status(422).json({
    //     errors: firstError,
    //   });
    // }
    const { id } = req.params;
    const { name, specialization, phone, email, availability } = req.body;
    try {
        const doctor = yield doctor_model_1.default.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        // doctor.name = name || doctor.name;
        // doctor.specialization = specialization || doctor.specialization;
        // doctor.phone = phone || doctor.phone;
        // doctor.email = email || doctor.email;
        // doctor.availability = availability || doctor.availability;
        // await doctor.save();
        // const UserUpdate = await User.findByIdAndUpdate(
        //   doctor?.userId,
        //   {
        //     ...req.body,
        //   },
        //   {
        //     new: true,
        //   }
        // );
        const updateDoctor = yield doctor_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        return res.status(200).json({
            success: true,
            msg: "Doctor updated successfully.",
            doctor: updateDoctor,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error updating doctor.", error });
    }
}));
exports.deleteDoctorController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const doctor = yield doctor_model_1.default.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        yield appointment_model_1.default.updateMany({ doctor: doctor._id, status: { $ne: "completed" } }, { status: "canceled" });
        yield user_model_1.default.findByIdAndDelete(doctor === null || doctor === void 0 ? void 0 : doctor.userId);
        return res.status(200).json({
            success: true,
            msg: "Doctor deleted successfully and associated appointments canceled.",
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, msg: "Error deleting doctor.", error });
    }
}));
