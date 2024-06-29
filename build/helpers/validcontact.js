"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContact = void 0;
const express_validator_1 = require("express-validator");
exports.validateContact = [
    (0, express_validator_1.check)("empDocID", "empDocID is required").notEmpty().isEmail(),
    (0, express_validator_1.check)("contact.email", "Email is required").notEmpty().isEmail().isLength({ min: 5 }),
];
