import { Schema, model } from "mongoose";

const specializationSchema = new Schema(
  {
    patient: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Specialization = model("Specialization", specializationSchema);
export default Specialization;
