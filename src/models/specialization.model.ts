import { Schema, model } from "mongoose";

const specializationSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Specialization = model("Specialization", specializationSchema);
export default Specialization;
