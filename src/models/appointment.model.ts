import mongoose, { Document, Schema, Types, model } from "mongoose";

export interface IAppointment extends Document {
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  description: string;
  date: Date;
  time: string;
  status: string;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["scheduled", "completed", "canceled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IAppointment>("Appointment", appointmentSchema);
