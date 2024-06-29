"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const availabilitySchema = new mongoose_1.Schema({
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    maxPatient: { type: Number, required: true },
});
const doctorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    specialization: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    picture: { type: String, required: false },
    phone: { type: String, required: true },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "others"],
    },
    about: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    fee: { type: Number, required: true },
    rating: { type: Number, required: true, max: 5, min: 1 },
    availability: { type: [availabilitySchema], required: false, default: [] },
    userId: {
        type: mongoose_1.default.Types.ObjectId,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
doctorSchema.virtual("appointments", {
    ref: "Appointment",
    localField: "_id",
    foreignField: "doctor",
    justOne: false,
});
doctorSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "doctor",
    justOne: false,
});
exports.default = (0, mongoose_1.model)("Doctor", doctorSchema);
