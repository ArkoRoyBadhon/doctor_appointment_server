import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ErrorHandler from "../utils/errorhandler";
import createToken from "../utils/jwtToken";
import Patient from "../models/patient.model";
import User from "../models/user.model";

// import shopModel from "../models/shop.model";

// Register Account
export const checkEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(errors.array()[0].msg, 422);
    }
    const existingEmail = await Patient.findOne({ email });

    if (existingEmail) {
      return res.json({
        success: true,
        exist: true,
        message: "Email checked",
      });
    }

    return res.json({
      success: true,
      exist: false,
      message: "Email checked",
    });
  } catch (error) {
    next(error);
  }
};

// Register customer Account
export const registerCustomerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, password, age, gender, phone } = req.body;
    const errors = validationResult(req);
    console.log("sss", req.body);
    
    if (!errors.isEmpty()) {
      throw new ErrorHandler(errors.array()[0].msg, 422);
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new ErrorHandler("This email is already used!", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    const token = createToken(user, "7d");
    const userWithoutPassword = user.toObject();
    const { password: _, ...userResponse } = userWithoutPassword;

    try {
      const existingPatient = await Patient.findOne({ email });

      if (existingPatient) {
        return res
          .status(400)
          .json({ message: "Patient with this email already exists" });
      }

      const newPatient = await Patient.create({
        name,
        age,
        gender,
        phone,
        email,
        userId: userResponse._id
      });

      // res.status(201).json(newPatient);
    } catch (error) {
      // res.status(500).json({ message: "Error creating patient", error });
    }

    return res.json({
      success: true,
      message: "Account created success",
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};


// Login patient Account
export const signinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new ErrorHandler(errors.array()[0].msg, 422);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorHandler("Email is not registered", 400);
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new ErrorHandler("Password is not match", 400);
    }
    const token = createToken(user, "7d");
    const userWithoutPassword = user.toObject();
    const { password: _, ...userResponse } = userWithoutPassword;

    return res.json({
      success: true,
      message: "Signin success",
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};


// Forgot Password
// export const forgotPasswordController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email } = req.body;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       throw new ErrorHandler(errors.array()[0].msg, 422);
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new ErrorHandler("User with that email does not exist", 400);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// // Reset Password
// export const resetPasswordController = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       throw new ErrorHandler(errors.array()[0].msg, 422);
//     }
//     return res.json({ message: "Password reset successful" });
//   } catch (error) {
//     next(error);
//   }
// };
