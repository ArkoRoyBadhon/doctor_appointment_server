"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    isAproved: { type: Boolean, required: false, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    role: {
        type: String,
        default: "patient",
        enum: ["doctor", "patient", "admin"],
    },
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
