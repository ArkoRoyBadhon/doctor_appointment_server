// types/availabilityTypes.ts

import { Document, ObjectId } from "mongoose";

interface IAvailability {
  day: string;
  startTime: string;
  endTime: string;
  maxPatient: number;
}

export interface IDoctor extends Document {
  name: string;
  specialization: ObjectId;
  phone: string;
  gender: string;
  email: string;
  location: string;
  picture: string;
  about: string;
  rating: number;
  fee: number;
  availability: IAvailability[];
  reviews?: ObjectId[];
  userId?: ObjectId;
}

export interface IAppointment extends Document {
  doctor: ObjectId;
  patientName: string;
  patientPhone: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
}

export interface AvailabilityCheckResult {
  available: boolean;
  message: string;
}
