import mongoose, { Document, Schema, Types, model } from "mongoose";

export interface IAppointment extends Document {
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  description: string;
  date?: Date;
  startTime: string;
  endTime: string;
  status: string;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    description: { type: String, required: true },
    date: { type: Date },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
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

appointmentSchema.pre('save', function (next) {
  if (!this.date) {
    const dayOfWeek = this.startTime.split(':')[0]; // Assuming startTime format includes day
    this.date = getNextDate(dayOfWeek);
  }
  next();
});

function getNextDate(dayOfWeek: string): Date {
  const daysOfWeekMap: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const today = new Date();
  const currentDay = today.getDay();
  const targetDay = daysOfWeekMap[dayOfWeek];

  let daysToAdd = targetDay - currentDay;
  if (daysToAdd < 0) {
    daysToAdd += 7; // Go to the next week
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysToAdd);
  return nextDate;
}

export default model<IAppointment>("Appointment", appointmentSchema);
