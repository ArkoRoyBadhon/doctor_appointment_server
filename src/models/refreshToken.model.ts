import mongoose, { Schema, model } from "mongoose";

const RefreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: false,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RefreshToken = model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
