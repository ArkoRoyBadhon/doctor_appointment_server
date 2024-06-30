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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverPassword = exports.forgotPassword = exports.resetPassword = exports.getAccessToken = exports.signinController = exports.registerDoctorController = exports.registerCustomerController = exports.updateUserController = exports.getAuthState = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const doctor_model_1 = __importDefault(require("../models/doctor.model"));
const patient_model_1 = __importDefault(require("../models/patient.model"));
const refreshToken_model_1 = __importDefault(require("../models/refreshToken.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const jwtToken_1 = require("../utils/jwtToken");
// import shopModel from "../models/shop.model";
// Register Account
exports.getAuthState = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.json({ success: false });
    try {
        let userData;
        if (user.role === "doctor") {
            userData = yield doctor_model_1.default.findOne({ userId: user._id });
        }
        if (user.role === "patient") {
            userData = yield patient_model_1.default.findOne({ userId: user._id });
        }
        else if (user.role !== "doctor" && user.role !== "doctor") {
            userData = yield user_model_1.default.findById(user._id);
        }
        if (userData) {
            // console.log("ddd 2", userData);
            return res.json({
                success: true,
                message: "User info get successfull",
                data: userData,
                role: user.role,
            });
        }
        else {
            return res.json({
                success: false,
                message: "Failed",
                // data: userData,
            });
        }
    }
    catch (error) {
        return res.json({
            success: false,
            message: "User failed",
        });
    }
}));
exports.updateUserController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { name, age, gender, phone, picture, email, location, about, fee } = req.body;
    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        let userData;
        if (user.role === "doctor") {
            // console.log("incoming", req.body);
            userData = yield doctor_model_1.default.findOneAndUpdate({ userId: user._id }, { name, phone, email, location, picture, about, fee }, { new: true, runValidators: true });
        }
        else if (user.role === "patient") {
            userData = yield patient_model_1.default.findOneAndUpdate({ userId: user._id }, { name, age, gender, phone, email, location, picture }, { new: true, runValidators: true });
        }
        else {
            userData = yield user_model_1.default.findByIdAndUpdate(user._id, { name, email, phone }, { new: true, runValidators: true });
        }
        if (userData) {
            res.json({
                success: true,
                message: "User info updated successfully",
                data: userData,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Failed to update user info",
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error,
        });
    }
}));
// Register customer Account
exports.registerCustomerController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, age, gender, phone } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    console.log("sss", req.body);
    if (!errors.isEmpty()) {
        throw new errorhandler_1.default(errors.array()[0].msg, 422);
    }
    const existingEmail = yield user_model_1.default.findOne({ email });
    if (existingEmail) {
        throw new errorhandler_1.default("This email is already used!", 400);
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield user_model_1.default.create({
        email,
        name,
        isAproved: true,
        password: hashedPassword,
    });
    // hash password salt id
    const tokenPayload = {
        email: user.email,
        userId: user._id,
        role: user.role,
    };
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)(tokenPayload); // expire time => 30day
    const userWithoutPassword = user.toObject();
    const { password: _ } = userWithoutPassword, userResponse = __rest(userWithoutPassword, ["password"]);
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
        userId: userResponse._id,
    });
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    yield refreshToken_model_1.default.create({
        token: refreshToken,
        userId: newPatient._id,
        expiration_time: expiresAt,
    });
    // res.status(201).json(newPatient);
    return res.json({
        success: true,
        message: "Account created success",
        accessToken,
        // refreshToken,
        user: userResponse,
    });
}));
exports.registerDoctorController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, specialization, phone, email, password, availability } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    console.log("sss", req.body);
    if (!errors.isEmpty()) {
        throw new errorhandler_1.default(errors.array()[0].msg, 422);
    }
    const existingEmail = yield user_model_1.default.findOne({ email });
    if (existingEmail) {
        throw new errorhandler_1.default("This email is already used!", 400);
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield user_model_1.default.create({
        email,
        name,
        password: hashedPassword,
        role: "doctor",
        isAproved: false,
    });
    // hash password salt id
    const tokenPayload = {
        email: user.email,
        userId: user._id,
        role: user.role,
    };
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)(tokenPayload); // expire time => 30day
    const userWithoutPassword = user.toObject();
    const { password: _ } = userWithoutPassword, userResponse = __rest(userWithoutPassword, ["password"]);
    const existingDoctor = yield doctor_model_1.default.findOne({ email });
    if (existingDoctor) {
        return res
            .status(400)
            .json({ message: "Doctor with this email already exists" });
    }
    const newDoctor = yield doctor_model_1.default.create({
        name,
        phone,
        email,
        specialization,
        availability,
        userId: userResponse._id,
    });
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    yield refreshToken_model_1.default.create({
        token: refreshToken,
        userId: newDoctor._id,
        expiration_time: expiresAt,
    });
    // res.status(201).json(newPatient);
    return res.json({
        success: true,
        message: "Account created success",
        accessToken,
        refreshToken,
        user: userResponse,
    });
}));
// Login user Account
const signinController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorhandler_1.default(errors.array()[0].msg, 422);
        }
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            throw new errorhandler_1.default("Email is not registered", 400);
        }
        // if (!user.isAproved && user.role === "doctor") {
        //   return res.json({
        //     success: false,
        //     messsage:
        //       "Please wait for admin confrimation, your request is under review",
        //     data: null,
        //   });
        // }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new errorhandler_1.default("Password is not match", 400);
        }
        const tokenPayload = {
            email: user.email,
            userId: user._id,
            role: user.role,
        };
        const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
        const refreshToken = (0, jwtToken_1.createRefreshToken)(tokenPayload); // expire time => 30 day
        const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        yield refreshToken_model_1.default.create({
            token: refreshToken,
            userId: user._id,
            expiration_time: expiresAt,
        });
        const userWithoutPassword = user.toObject();
        const { password: _ } = userWithoutPassword, userResponse = __rest(userWithoutPassword, ["password"]);
        return res.json({
            success: true,
            message: "Signin success",
            user: userResponse,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signinController = signinController;
// generet token
const getAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; /// refresh token
    if (!token)
        return res.sendStatus(401);
    // asdfasfd. decode
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    try {
        const refreshToken = yield refreshToken_model_1.default.findOne({
            token,
        });
        if (!refreshToken) {
            return res.status(401).json({ success: false, message: "Unauthotized" });
        }
        const today = new Date().getTime();
        if (today > refreshToken.expiration_time) {
            return res.status(401).json({ success: false, message: "Unauthotized" });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken.token, refreshSecret);
        const tokenUser = decoded.user;
        // checking if the user is exist
        const user = yield user_model_1.default.findById(tokenUser.userId);
        if (!user) {
            throw new errorhandler_1.default("This user is not found !", 404);
        }
        const jwtPayload = {
            userId: user.id,
            role: user.role,
        };
        const accessToken = (0, jwtToken_1.createAcessToken)(jwtPayload, "1h");
        res.json({
            success: true,
            data: null,
            message: "access token retive successfully",
            token: accessToken,
        });
    }
    catch (error) {
        res.status(401).json({ success: false, message: "unautorized access" });
    }
});
exports.getAccessToken = getAccessToken;
// reset Password
exports.resetPassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, oldPassword, email } = req.body;
    const user = req.user;
    if (!password || !oldPassword || !email) {
        return res.json({
            message: "password, oldPassword and email => is required",
        });
    }
    const theUser = yield user_model_1.default.findOne({ email });
    // check if there no user
    if (!theUser) {
        return res.json({ message: `no user find on ${email}` });
    }
    // check is the email is same or not
    if (theUser.email !== user.email) {
        return res
            .status(403)
            .json({ message: "Email didn't matched=> forbiden access" });
    }
    // varify old password
    const isOk = yield bcryptjs_1.default.compare(oldPassword, theUser.password);
    if (!isOk) {
        return res.json({ message: "password didn't matched", success: false });
    }
    // create new hash password
    const newPass = yield bcryptjs_1.default.hash(password, 15);
    // update the new
    const updatePassword = yield user_model_1.default.findOneAndUpdate({ email }, {
        $set: {
            password: newPass,
        },
    });
    res.json({
        message: "password Updated",
        success: true,
        user: Object.assign(Object.assign({}, updatePassword === null || updatePassword === void 0 ? void 0 : updatePassword.toObject()), { password: "****" }),
    });
}));
// // Forgot Password
exports.forgotPassword = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        return res
            .status(400)
            .json({ success: false, message: "No user found with this email!" });
    }
    const token = (0, jwtToken_1.createAcessToken)({ id: user._id, role: user.role, email: user.email }, "5m");
    // user.resetPasswordToken = token;
    // user.resetPasswordExpires = Date.now() + 300000;
    yield user.save();
    res.status(200).json({
        success: true,
        message: "Check your email to recover the password",
        token: token,
    });
}));
exports.recoverPassword = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const payload = req.body;
    const token = req.headers.authorization;
    const user = yield user_model_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.id);
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
    //localhost:5000?id=6441555asfasdf5&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4
    if (payload.id !== decoded.userId) {
        throw new errorhandler_1.default("Forbiden access", 403);
    }
    //hash new password
    const newHashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, 10);
    yield user_model_1.default.findOneAndUpdate({
        id: decoded.userId,
        role: decoded.role,
    }, {
        password: newHashedPassword,
    });
    res;
}));
