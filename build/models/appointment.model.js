"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const appointmentSchema = new mongoose_1.Schema({
    doctor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: mongoose_1.Schema.Types.ObjectId, ref: "Patient", required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["scheduled", "completed", "canceled"],
        default: "scheduled",
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Appointment", appointmentSchema);
