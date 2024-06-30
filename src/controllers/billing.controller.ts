import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import { validationResult } from "express-validator";
import Billing from "../models/billing.model";
import Appointment from "../models/appointment.model";

export const createBillingController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }

    const { appointment, patient, doctor, amount, status } = req.body;
    // appointment, patient, doctor, amount, status, date 
    console.log(appointment);
    
    try {
      const existingAppointment = await Appointment.findById(appointment);

      if (!existingAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      if (existingAppointment.patient.toString() !== patient) {
        return res.status(400).json({
          message: "The patient does not match the appointment's patient",
        });
      }

      const existingBilling = await Billing.findOne({
        appointment: appointment,
      });

      if (
        existingAppointment.status === "completed" &&
        existingBilling?.status === "paid"
      ) {
        return res
          .status(400)
          .json({ message: "Appointment & billing already completed and paid" });
      }

      const newBilling = await Billing.create({
        appointment,
        patient,
        doctor,
        amount,
        status,
      });

      if (newBilling) {
        await Appointment.findByIdAndUpdate(
          appointment,
          { status: "completed" },
          { new: true }
        );
      }

      res.status(201).json(newBilling);
    } catch (error) {
      res.status(500).json({ message: "Error creating billing record", error });
    }
  }
);

export const getAllBillingController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billingRecords = await Billing.find()
        .populate("patient", "name email")
        .populate("doctor", "name specialization");

      return res.status(200).json({
        success: true,
        msg: "Billing records have been retrieved successfully.",
        billingRecords,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Error retrieving billing records.",
        error,
      });
    }
  }
);

export const getAllBillingByUserController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if(!user) {
      return res.status(500).json("user not found")
    }
    try {
      const billingRecords = await Billing.findById(user.userId)
        .populate("patient", "name email")
        .populate("doctor", "name specialization");

      return res.status(200).json({
        success: true,
        msg: "Billing records have been retrieved successfully.",
        billingRecords,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Error retrieving billing records.",
        error,
      });
    }
  }
);

export const getBillingByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const billing = await Billing.findById(id)
        .populate("appointment", "date time")
        .populate("patient", "name");

      if (!billing) {
        return res.status(404).json({ message: "Billing record not found" });
      }

      return res.status(200).json({
        success: true,
        msg: "Billing record retrieved successfully.",
        billing,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "Error retrieving billing record.",
        error,
      });
    }
  }
);

export const updateBillingController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    }

    const { id } = req.params;
    const { appointment, amount, status } = req.body;

    try {
      const billing = await Billing.findById(id);

      if (!billing) {
        return res.status(404).json({ message: "Billing record not found" });
      }

      billing.appointment = appointment || billing.appointment;
      billing.amount = amount || billing.amount;
      billing.status = status || billing.status;

      await billing.save();

      return res.status(200).json({
        success: true,
        msg: "Billing record updated successfully.",
        billing,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error updating billing record.", error });
    }
  }
);

export const deleteBillingController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const billing = await Billing.findByIdAndDelete(id);

      if (!billing) {
        return res.status(404).json({ message: "Billing record not found" });
      }

      return res.status(200).json({
        success: true,
        msg: "Billing record deleted successfully.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Error deleting billing record.", error });
    }
  }
);
