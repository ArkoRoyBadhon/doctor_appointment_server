import { check } from "express-validator";

export const validateEmp = [check("Emp_ID", "Emp_ID is required").notEmpty(),
check("First_Name", "First_Name is required").notEmpty().isLength({ min: 2 }),
check("Last_Name", "Last_Name is required").notEmpty().isLength({ min: 2 }),
check("email", "email is required").notEmpty().isEmail().isLength({ min: 2 })
];
