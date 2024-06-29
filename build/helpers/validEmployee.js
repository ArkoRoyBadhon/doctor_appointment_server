"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmp = void 0;
const express_validator_1 = require("express-validator");
exports.validateEmp = [(0, express_validator_1.check)("Emp_ID", "Emp_ID is required").notEmpty(),
    (0, express_validator_1.check)("First_Name", "First_Name is required").notEmpty().isLength({ min: 2 }),
    (0, express_validator_1.check)("Last_Name", "Last_Name is required").notEmpty().isLength({ min: 2 }),
    (0, express_validator_1.check)("email", "email is required").notEmpty().isEmail().isLength({ min: 2 })
];
