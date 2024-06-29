"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const billingSchema = new mongoose_1.Schema({
    appointment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Appointment", required: true, unique: true },
    patient: { type: mongoose_1.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Doctor", required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, enum: ["pending", "paid", "failed"], default: "pending" },
    paymentDate: { type: Date },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Billing", billingSchema);
