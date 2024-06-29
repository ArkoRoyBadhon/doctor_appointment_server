"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddress = void 0;
const express_validator_1 = require("express-validator");
exports.validateAddress = [
    (0, express_validator_1.check)("empDocID", "empDocID is required").isEmpty(),
    (0, express_validator_1.check)("address.city", "City is required")
        .isLength({ min: 2 }),
    (0, express_validator_1.check)("address.area", "Area is required")
        .isLength({ min: 2 }),
    (0, express_validator_1.check)("address.state", "State is required")
        .isLength({ min: 2 }),
];
