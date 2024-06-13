import { check } from "express-validator";

export const validateAddress = [
  check("empDocID", "empDocID is required").isEmpty(),
  check("address.city", "City is required")
  .isLength({ min: 2 }),
  check("address.area", "Area is required")
    .isLength({ min: 2 }),
  check("address.state", "State is required")
    .isLength({ min: 2 }),
];
