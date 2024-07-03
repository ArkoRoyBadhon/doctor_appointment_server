"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const specializationSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
}, {
    timestamps: true,
});
const Specialization = (0, mongoose_1.model)("Specialization", specializationSchema);
exports.default = Specialization;
