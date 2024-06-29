import mongoose, { Document, Schema, model } from "mongoose";
import { IReview } from "./review.model";
import { IAppointment } from "./appointment.model";

interface IAvailability {
  day: string;
  startTime: string;
  endTime: string;
  maxPatient: number;
}

export interface IDoctor extends Document {
  name: string;
  specialization: mongoose.Types.ObjectId;
  phone: string;
  email: string;
  availability: IAvailability[];
  reviews?: IReview["_id"][];
  userId?: any;
}

const availabilitySchema = new Schema<IAvailability>({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  maxPatient: { type: Number, required: true },
});

const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Specialization",
    },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    availability: { type: [availabilitySchema], required: true },
    userId: { type: mongoose.Types.ObjectId },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

doctorSchema.virtual("appointments", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "doctor",
  justOne: false,
});

doctorSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "doctor",
  justOne: false,
});

export default model<IDoctor>("Doctor", doctorSchema);
