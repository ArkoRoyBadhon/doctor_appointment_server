import { Schema, model, Document } from "mongoose";
import { IDoctor } from "./doctor.model";
import { IPatient } from "./patient.model";

export interface IReview extends Document {
  patient: IPatient["_id"];
  doctor: IDoctor["_id"];
  rating: number;
  comment: string;
  date: Date;
  appointment: string;
}

const reviewSchema = new Schema<IReview>(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    appointment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<IReview>("Review", reviewSchema);
