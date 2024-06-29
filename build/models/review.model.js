"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    patient: { type: mongoose_1.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose_1.Schema.Types.ObjectId, ref: "Doctor", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    appointment: { type: String, required: true },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Review", reviewSchema);
