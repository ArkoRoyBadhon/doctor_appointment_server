import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import Patient from "../models/patient.model";
import Appointment from "../models/appointment.model";

export const createPatientController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }

    const { name, age, gender, phone, email } = req.body;

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
      });

      res.status(201).json(newPatient);
    } catch (error) {
      res.status(500).json({ message: "Error creating patient", error });
    }
  }
);

export const getAllPatientsController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await Patient.find();

      return res.status(200).json({
        success: true,
        msg: "Patients have been retrieved successfully.",
        patients,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error retrieving patients.", error });
    }
  }
);

export const getPatientByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const patient = await Patient.findById(id).populate("reviews")

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      return res.status(200).json({
        success: true,
        msg: "Patient retrieved successfully.",
        patient,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error retrieving patient.", error });
    }
  }
);

export const updatePatientController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }

    const { id } = req.params;
    const { name, age, gender, phone, email } = req.body;

    try {
      const patient = await Patient.findById(id);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      patient.name = name || patient.name;
      patient.age = age || patient.age;
      patient.gender = gender || patient.gender;
      patient.phone = phone || patient.phone;
      patient.email = email || patient.email;

      await patient.save();

      return res.status(200).json({
        success: true,
        msg: "Patient updated successfully.",
        patient,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error updating patient.", error });
    }
  }
);

export const deletePatientController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const patient = await Patient.findByIdAndDelete(id);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      await Appointment.updateMany(
        { patient: patient._id, status: { $ne: "completed" } },
        { status: "canceled" }
      );

      return res.status(200).json({
        success: true,
        msg: "Patient deleted successfully.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error deleting patient.", error });
    }
  }
);
