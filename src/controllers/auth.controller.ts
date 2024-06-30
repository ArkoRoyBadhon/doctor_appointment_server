import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Doctor from "../models/doctor.model";
import Patient from "../models/patient.model";
import RefreshToken from "../models/refreshToken.model";
import User from "../models/user.model";
import ErrorHandler from "../utils/errorhandler";
import { createAcessToken, createRefreshToken } from "../utils/jwtToken";

// import shopModel from "../models/shop.model";

// Register Account

export const getAuthState = catchAsyncError(async (req, res) => {
  const user = req.user;

  if (!user) return res.json({ success: false });

  try {
    let userData;
    if (user.role === "doctor") {
      userData = await Doctor.findOne({ userId: user._id });
    }
    if (user.role === "patient") {
      userData = await Patient.findOne({ userId: user._id });
    } else if (user.role !== "doctor" && user.role !== "doctor") {
      userData = await User.findById(user._id);
    }

    if (userData) {
      // console.log("ddd 2", userData);

      return res.json({
        success: true,
        message: "User info get successfull",
        data: userData,
        role: user.role,
      });
    } else {
      return res.json({
        success: false,
        message: "Failed",
        // data: userData,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "User failed",
    });
  }
});

export const updateUserController = catchAsyncError(async (req, res) => {
  const user = req.user;
  const { name, age, gender, phone, picture, email, location, about, fee } =
    req.body;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    let userData;
    if (user.role === "doctor") {
      // console.log("incoming", req.body);

      userData = await Doctor.findOneAndUpdate(
        { userId: user._id },
        { name, phone, email, location, picture, about, fee },
        { new: true, runValidators: true }
      );
    } else if (user.role === "patient") {
      userData = await Patient.findOneAndUpdate(
        { userId: user._id },
        { name, age, gender, phone, email, location, picture },
        { new: true, runValidators: true }
      );
    } else {
      userData = await User.findByIdAndUpdate(
        user._id,
        { name, email, phone },
        { new: true, runValidators: true }
      );
    }

    if (userData) {
      res.json({
        success: true,
        message: "User info updated successfully",
        data: userData,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update user info",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
});

// Register customer Account
export const registerCustomerController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
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
      isAproved: true,
      password: hashedPassword,
    });

    // hash password salt id
    const tokenPayload = {
      email: user.email,
      userId: user._id,
      role: user.role,
    };

    const accessToken = createAcessToken(tokenPayload, "1h");
    const refreshToken = createRefreshToken(tokenPayload); // expire time => 30day
    const userWithoutPassword = user.toObject();
    const { password: _, ...userResponse } = userWithoutPassword;

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
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await RefreshToken.create({
      token: refreshToken,
      userId: newPatient._id,
      expiration_time: expiresAt,
    });

    // res.status(201).json(newPatient);

    return res.json({
      success: true,
      message: "Account created success",
      accessToken,
      // refreshToken,
      user: userResponse,
    });
  }
);

export const registerDoctorController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, specialization, phone, email, password, availability } =
      req.body;
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
      role: "doctor",
      isAproved: false,
    });

    // hash password salt id
    const tokenPayload = {
      email: user.email,
      userId: user._id,
      role: user.role,
    };

    const accessToken = createAcessToken(tokenPayload, "1h");
    const refreshToken = createRefreshToken(tokenPayload); // expire time => 30day
    const userWithoutPassword = user.toObject();
    const { password: _, ...userResponse } = userWithoutPassword;

    const existingDoctor = await Doctor.findOne({ email });

    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Doctor with this email already exists" });
    }

    const newDoctor = await Doctor.create({
      name,
      phone,
      email,
      specialization,
      availability,
      userId: userResponse._id,
    });
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await RefreshToken.create({
      token: refreshToken,
      userId: newDoctor._id,
      expiration_time: expiresAt,
    });

    // res.status(201).json(newPatient);

    return res.json({
      success: true,
      message: "Account created success",
      accessToken,
      refreshToken,
      user: userResponse,
    });
  }
);

// Login user Account
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

    // if (!user.isAproved && user.role === "doctor") {
    //   return res.json({
    //     success: false,
    //     messsage:
    //       "Please wait for admin confrimation, your request is under review",
    //     data: null,
    //   });
    // }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new ErrorHandler("Password is not match", 400);
    }
    const tokenPayload = {
      email: user.email,
      userId: user._id,

      role: user.role,
    };

    const accessToken = createAcessToken(tokenPayload, "1h");
    const refreshToken = createRefreshToken(tokenPayload); // expire time => 30 day

    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiration_time: expiresAt,
    });

    const userWithoutPassword = user.toObject();
    const { password: _, ...userResponse } = userWithoutPassword;

    return res.json({
      success: true,
      message: "Signin success",
      user: userResponse,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// generet token
export const getAccessToken = async (req: Request, res: Response) => {
  const token = req.headers["authorization"]?.split(" ")[1]; /// refresh token
  if (!token) return res.sendStatus(401);

  // asdfasfd. decode

  const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
  try {
    const refreshToken = await RefreshToken.findOne({
      token,
    });
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthotized" });
    }
    const today = new Date().getTime();

    if (today > refreshToken.expiration_time) {
      return res.status(401).json({ success: false, message: "Unauthotized" });
    }

    const decoded: any = jwt.verify(
      refreshToken.token as string,
      refreshSecret as string
    );

    const tokenUser = decoded.user;

    // checking if the user is exist
    const user = await User.findById(tokenUser.userId);

    if (!user) {
      throw new ErrorHandler("This user is not found !", 404);
    }

    const jwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = createAcessToken(jwtPayload, "1h");
    res.json({
      success: true,
      data: null,
      message: "access token retive successfully",
      token: accessToken,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "unautorized access" });
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

  const token = createAcessToken(
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

export const recoverPassword = catchAsyncError(async (req, res) => {
  // checking if the user is exist
  const payload = req.body;
  const token = req.headers.authorization as string;
  const user = await User.findById(payload?.id);

  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as JwtPayload;

  //localhost:5000?id=6441555asfasdf5&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.id !== decoded.userId) {
    throw new ErrorHandler("Forbiden access", 403);
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
  res;
});
