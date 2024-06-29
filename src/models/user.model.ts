import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "doctor" | "patient" | "admin";
  isAproved: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    isAproved: { type: Boolean, required: false,},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "patient",
      enum: ["doctor", "patient", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
