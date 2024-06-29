"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePersonalInfo = void 0;
const express_validator_1 = require("express-validator");
exports.validatePersonalInfo = [
    (0, express_validator_1.check)("Emp_ID", "Emp_ID is required").notEmpty(),
    (0, express_validator_1.check)("personal_details.First_Name", "First_Name is required or minimum character 2").isLength({ min: 2 }),
    (0, express_validator_1.check)("personal_details.Last_Name", "Last_Name is required or minimum character 2").isLength({ min: 2 }),
];
