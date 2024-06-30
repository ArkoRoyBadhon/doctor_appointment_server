import { Document, Schema, Types, model } from "mongoose";

export interface IBilling extends Document {
  appointment: Types.ObjectId;
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  amount: number;
  status: string;
  paymentDate: Date;
}

const billingSchema = new Schema<IBilling>(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentDate: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

export default model<IBilling>("Billing", billingSchema);
