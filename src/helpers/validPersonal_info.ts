import { check } from "express-validator";

export const validatePersonalInfo = [
  check("Emp_ID", "Emp_ID is required").notEmpty(),
  check("personal_details.First_Name", "First_Name is required or minimum character 2").isLength({ min: 2 }),
  check("personal_details.Last_Name", "Last_Name is required or minimum character 2").isLength({ min: 2 }),
];

