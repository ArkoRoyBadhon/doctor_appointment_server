


import { check } from "express-validator";

export const validateContact = [
    check("empDocID", "empDocID is required").notEmpty().isEmail(),
    check("contact.email", "Email is required").notEmpty().isEmail().isLength({ min: 5 }),
]




