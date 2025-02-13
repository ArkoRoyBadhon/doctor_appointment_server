import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import Doctor from "../models/doctor.model";
import Appointment from "../models/appointment.model";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const createDoctorController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const user = req.user;

    if (!user) {
      return res.status(422).json({
        errors: "Something went wrong",
      });
    }

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }

    const { name, specialization, phone, password, email, availability } =
      req.body;

    try {
      const existingDoctor = await Doctor.findOne({ email });

      if (existingDoctor) {
        return res
          .status(400)
          .json({ message: "Doctor with this email already exists" });
      }

      const newDoctor = await Doctor.create({
        name,
        specialization,
        phone,
        email,
        availability,
        userId: user._id,
      });

      // Check if a user with the same email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "This email is already used!" });
      }

      // const password = "12345678";

      // Validate password before hashing
      if (!password) {
        throw new Error("Password must be provided");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userDoc = await User.create({
        email,
        name,
        isAproved: true,
        password: hashedPassword,
        role: "doctor",
      });

      res.status(201).json(newDoctor);
    } catch (error) {
      res.status(500).json({ message: "Error creating doctor", error });
    }
  }
);

export const getAllDoctorsController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        specialization,
        gender,
        minFee,
        maxFee,
        page = 1,
        limit = 6,
      } = req.query;

      const query: any = {};

      // Name filter
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }

      // Specialization filter
      if (specialization) {
        if (mongoose.Types.ObjectId.isValid(specialization as string)) {
          query.specialization = new mongoose.Types.ObjectId(
            specialization as string
          );
        } else {
          return res.status(400).json({
            success: false,
            msg: "Invalid specialization ID format.",
          });
        }
      }

      // Gender filter
      if (gender) {
        query.gender = gender;
      }

      // Fee filter
      if (minFee && maxFee) {
        query.fee = { $gte: Number(minFee), $lte: Number(maxFee) };
      } else if (minFee) {
        query.fee = { $gte: Number(minFee) };
      } else if (maxFee) {
        query.fee = { $lte: Number(maxFee) };
      }

      // Pagination
      const skip = (Number(page) - 1) * Number(limit);

      const doctors = await Doctor.find(query).skip(skip).limit(Number(limit));

      return res.status(200).json({
        success: true,
        msg: "Doctors have been retrieved successfully.",
        doctors,
        page: Number(page),
        limit: Number(limit),
        total: await Doctor.countDocuments(query),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error retrieving doctors.", error });
    }
  }
);


export const getDoctorByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      // const doctor = await Doctor.findById(id).populate("reviews");
      const doctor = await Doctor.findById(id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'patient',
          model: 'User',
        },
      });
      

      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }

      // console.log("revv,", doctor);
      

      return res.status(200).json({
        success: true,
        msg: "Doctor retrieved successfully.",
        doctor,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error retrieving doctor.", error });
    }
  }
);

export const updateDoctorController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   const firstError = errors.array().map((error) => error.msg)[0];
    //   return res.status(422).json({
    //     errors: firstError,
    //   });
    // }

    const { id } = req.params;
    const { name, specialization, phone, email, availability } = req.body;

    try {
      const doctor = await Doctor.findById(id);

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // doctor.name = name || doctor.name;
      // doctor.specialization = specialization || doctor.specialization;
      // doctor.phone = phone || doctor.phone;
      // doctor.email = email || doctor.email;
      // doctor.availability = availability || doctor.availability;

      // await doctor.save();

      // const UserUpdate = await User.findByIdAndUpdate(
      //   doctor?.userId,
      //   {
      //     ...req.body,
      //   },
      //   {
      //     new: true,
      //   }
      // );

      const updateDoctor = await Doctor.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      return res.status(200).json({
        success: true,
        msg: "Doctor updated successfully.",
        doctor: updateDoctor,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error updating doctor.", error });
    }
  }
);

export const deleteDoctorController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const doctor = await Doctor.findByIdAndDelete(id);

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      await Appointment.updateMany(
        { doctor: doctor._id, status: { $ne: "completed" } },
        { status: "canceled" }
      );

      await User.findByIdAndDelete(doctor?.userId);

      return res.status(200).json({
        success: true,
        msg: "Doctor deleted successfully and associated appointments canceled.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error deleting doctor.", error });
    }
  }
);
