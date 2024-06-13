import mongoose, { Schema, model, Document } from 'mongoose';
import { IReview } from './review.model';

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  reviews?: IReview['_id'][];
  userId: any
}

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Types.ObjectId,
    
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  // toObject: { virtuals: true },
});


patientSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "patient",
  justOne: false,
});

// patientSchema.set("toObject", { virtuals: true });

export default model<IPatient>('Patient', patientSchema);
