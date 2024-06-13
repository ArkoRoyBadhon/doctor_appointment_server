import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import Doctor from "../models/doctor.model";
import Appointment from "../models/appointment.model";

export const createDoctorController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const userId = req.user

    if(!userId) {
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

    const { name, specialization, phone, email, availability } = req.body;

    try {
      const existingDoctor = await Doctor.findOne({ email });

      if (existingDoctor) {
        return res.status(400).json({ message: "Doctor with this email already exists" });
      }

      const newDoctor = await Doctor.create({ name, specialization, phone, email, availability, userId: userId?._id });

      res.status(201).json(newDoctor);
    } catch (error) {
      res.status(500).json({ message: "Error creating doctor", error });
    }
  }
);

export const getAllDoctorsController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctors = await Doctor.find();

      return res.status(200).json({
        success: true,
        msg: "Doctors have been retrieved successfully.",
        doctors,
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "Error retrieving doctors.", error });
    }
  }
);

export const getDoctorByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const doctor = await Doctor.findById(id).populate("reviews");

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      return res.status(200).json({
        success: true,
        msg: "Doctor retrieved successfully.",
        doctor,
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "Error retrieving doctor.", error });
    }
  }
);


export const updateDoctorController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }

    const { id } = req.params;
    const { name, specialization, phone, email, availability } = req.body;

    try {
      const doctor = await Doctor.findById(id);

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      doctor.name = name || doctor.name;
      doctor.specialization = specialization || doctor.specialization;
      doctor.phone = phone || doctor.phone;
      doctor.email = email || doctor.email;
      doctor.availability = availability || doctor.availability;

      await doctor.save();

      return res.status(200).json({
        success: true,
        msg: "Doctor updated successfully.",
        doctor,
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "Error updating doctor.", error });
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

      return res.status(200).json({
        success: true,
        msg: "Doctor deleted successfully and associated appointments canceled.",
      });
    } catch (error) {
      return res.status(500).json({ success: false, msg: "Error deleting doctor.", error });
    }
  }
);