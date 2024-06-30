import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import QueryBuilder from "../builder/QueryBuilder";
import getNextDate from "../helpers/getNextDate";
import checkSlotAvailability from "../helpers/slotAvailability";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Doctor from "../models/doctor.model";
import patientModel from "../models/patient.model";
import appointmentModel from "../models/appointment.model";
import User from "../models/user.model";
import doctorModel from "../models/doctor.model";

export const createAppointmentController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }

    const {
      doctor,
      patient,
      description,
      dayOfWeek,
      startTime,
      endTime,
      status,
    } = req.body;

    try {
      const existDoctor = await Doctor.findById(doctor);
      const existPatient = await patientModel.findById(patient);

      if (!existDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      if (!existPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const nextDate = getNextDate(dayOfWeek);

      // Check slot availability
      const availabilityCheck = await checkSlotAvailability(
        doctor,
        nextDate,
        startTime,
        endTime
      );

      if (!availabilityCheck.available) {
        return res.status(400).json({ message: availabilityCheck.message });
      }

      const dayAvailability = existDoctor.availability.find(
        (avail) => avail.day === dayOfWeek
      );

      if (!dayAvailability) {
        return res
          .status(400)
          .json({ message: `Doctor is not available on ${dayOfWeek}` });
      }

      // Check maxPatient limit
      const appointmentsCount = await appointmentModel.countDocuments({
        doctor,
        date: nextDate,
      });

      console.log("count ", appointmentsCount);
      console.log("count day", dayAvailability);
      console.log("pick date", nextDate);

      if (appointmentsCount >= dayAvailability.maxPatient) {
        return res
          .status(400)
          .json({ message: "Max patients limit exceeded for the day" });
      }

      const newAppointment = await appointmentModel.create({
        doctor,
        patient,
        description,
        date: nextDate,
        startTime,
        endTime,
        status: "scheduled",
      });

      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ message: "Error creating appointment", error });
    }
  }
);

export const getAllAppointmentsController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appointments = await appointmentModel.find()
        .populate("doctor", "name specialization")
        .populate("patient", "name email");

      return res.status(200).json({
        success: true,
        msg: "Appointments have been retrieved successfully.",
        appointments,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Error retrieving appointments.",
        error,
      });
    }
  }
);

export const getAppointmentByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const appointment = await appointmentModel.findById(id)
        .populate("doctor", "name specialization")
        .populate("patient", "name email");

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      return res.status(200).json({
        success: true,
        msg: "Appointment retrieved successfully.",
        appointment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Error retrieving appointment.",
        error,
      });
    }
  }
);

export const updateAppointmentController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }

    const { id } = req.params;
    const { doctor, patient, date, startTime, endTime, status } = req.body;

    try {
      const appointment = await appointmentModel.findById(id);

      if (!appointment) {
        return res.status(400).json({ message: "Appointment not found" });
      }

      const info = {
        doctor: doctor || appointment.doctor,
        patient: patient || appointment.patient,
        date: date || appointment.date,
        startTime: startTime || appointment.startTime,
        endTime: endTime || appointment.endTime,
        status: status || appointment.status,
      };

      console.log("prev", appointment);

      // await appointment.save();
      const result = await appointmentModel.findByIdAndUpdate(id, info, {
        new: true,
      });

      return res.status(200).json({
        success: true,
        msg: "Appointment updated successfully.",
        result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Error updating appointment.",
        error,
      });
    }
  }
);

export const deleteAppointmentController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const appointment = await appointmentModel.findByIdAndDelete(id);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      return res.status(200).json({
        success: true,
        msg: "Appointment deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Error deleting appointment.",
        error,
      });
    }
  }
);

export const getAllAppointmentsByDoctorController = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = req.user;
  
        if (!user) {
          return res.status(401).json({ message: "Unauthorized access" });
        }
  
        const existUser = await User.findById(user._id);
        if (!existUser) {
          return res.status(400).json({ message: "User not found" });
        }

        
  
        const existDoctor = await doctorModel.findOne({
          email: existUser.email,
        });
        if (!existDoctor) {
          return res.status(400).json({ message: "Doctor not found" });
        }

        const query = appointmentModel.find({ doctor: existDoctor._id })
          .populate("doctor", "name specialization")
          .populate("patient", "name email");
  
        const appointmentsQuery = new QueryBuilder(query, req.query)
          .filter()
          .paginate();
        const appointments = await appointmentsQuery.modelQuery;
  
        return res.status(200).json({
          success: true,
          msg: "Appointments have been retrieved successfully.",
          appointments,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          msg: "Error retrieving appointments.",
          error: error,
        });
      }
    }
  );


export const getAllAppointmentsByUserController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      // console.log("user iddd", user);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const existUser = await User.findById(user._id);
      if (!existUser) {
        return res.status(400).json({ message: "User not found" });
      }

      const existPatient = await patientModel.findOne({
        email: existUser.email,
      });
      if (!existPatient) {
        return res.status(400).json({ message: "Patient not found" });
      }

      const query = appointmentModel.find({ patient: existPatient._id })
        .populate("doctor", "name specialization")
        .populate("patient", "name email");

      const appointmentsQuery = new QueryBuilder(query, req.query)
        .filter()
        .paginate();
      const appointments = await appointmentsQuery.modelQuery;

      return res.status(200).json({
        success: true,
        msg: "Appointments have been retrieved successfully.",
        appointments,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Error retrieving appointments.",
        error: error,
      });
    }
  }
);
