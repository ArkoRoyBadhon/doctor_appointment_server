import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Patient from "../models/patient.model";
import User from "../models/user.model";
import ErrorHandler from "../utils/errorhandler";
import createToken from "../utils/jwtToken";

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
        userId: userResponse._id,
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

// reset Password
export const resetPassword = catchAsyncError(async (req: any, res, next) => {
  const { password, oldPassword, email } = req.body;

  const user = req.user;

  if (!password || !oldPassword || !email) {
    return res.json({
      message: "password, oldPassword and email => is required",
    });
  }

  const theUser = await User.findOne({ email });

  // check if there no user
  if (!theUser) {
    return res.json({ message: `no user find on ${email}` });
  }

  // check is the email is same or not
  if (theUser.email !== user.email) {
    return res
      .status(403)
      .json({ message: "Email didn't matched=> forbiden access" });
  }

  // varify old password
  const isOk = await bcrypt.compare(oldPassword, theUser.password as string);
  if (!isOk) {
    return res.json({ message: "password didn't matched", success: false });
  }

  // create new hash password
  const newPass = await bcrypt.hash(password, 15);

  // update the new
  const updatePassword = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        password: newPass,
      },
    }
  );

  res.json({
    message: "password Updated",
    success: true,
    user: { ...updatePassword?.toObject(), password: "****" },
  });
});

// // Forgot Password
export const forgotPassword = catchAsyncError(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "No user found with this email!" });
  }

  const token = createToken(
    { id: user._id, role: user.role, email: user.email },
    "5m"
  );

  // user.resetPasswordToken = token;
  // user.resetPasswordExpires = Date.now() + 300000;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Check your email to recover the password",
    token: token,
  });
});

const recoverPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  // checking if the user is exist
  const user = await User.findById(payload?.id);

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.id !== decoded.userId) {
    return;
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(payload.newPassword, 10);

  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
    }
  );
};
