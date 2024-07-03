import mongoose, { Document, Schema, model } from "mongoose";
import { IReview } from "./review.model";

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
  gender: string;
  email: string;
  location: string;
  picture: string;
  about: string;
  rating: number;
  fee: number;
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
    specialization: { type: mongoose.Schema.Types.ObjectId, ref: "Specialization", required: true },
    picture: { type: String, required: false },
    phone: { type: String, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    about: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    fee: { type: Number, required: true },
    rating: { type: Number, required: false, max: 5, min: 0, default: 0 },
    availability: { type: [availabilitySchema], required: false, default: [] },
    userId: {
      type: mongoose.Types.ObjectId,
    },
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
