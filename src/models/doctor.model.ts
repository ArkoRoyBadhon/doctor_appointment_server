import mongoose, { Schema, model, Document } from "mongoose";
import { IReview } from "./review.model";

interface IAvailability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IDoctor extends Document {
  name: string;
  specialization: string;
  phone: string;
  email: string;
  availability: IAvailability[];
  reviews?: IReview['_id'][];
  userId?: any
}

const availabilitySchema = new Schema<IAvailability>({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    availability: { type: [availabilitySchema], required: true },
    userId: {
      type: mongoose.Types.ObjectId,
      
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

doctorSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "doctor",
  justOne: false,
});

export default model<IDoctor>("Doctor", doctorSchema);
