
import Appointment from "../models/appointment.model";
import Doctor from "../models/doctor.model";
import { AvailabilityCheckResult, IDoctor } from "../types/availabilityType";

const checkSlotAvailability = async (
  doctorId: string,
  appointmentDate: Date,
  startTime: string,
  endTime: string
): Promise<AvailabilityCheckResult> => {
  const doctor: IDoctor | null = await Doctor.findById(doctorId);
  if (!doctor) {
    return { available: false, message: "Doctor not found" };
  }

  const dayOfWeek: string = appointmentDate.toLocaleString('en-us', { weekday: 'long' });
  const availability = doctor.availability.find(avail => avail.day === dayOfWeek);

  if (!availability) {
    return { available: false, message: "Doctor is not available on this day" };
  }

  const isTimeValid = startTime >= availability.startTime && endTime <= availability.endTime;
  if (!isTimeValid) {
    return { available: false, message: "Time slot is not within doctor's availability" };
  }

  const appointmentsCount: number = await Appointment.countDocuments({ 
    doctor: doctorId, 
    appointmentDate: appointmentDate.toISOString().split("T")[0],
    startTime: { $lte: endTime },
    endTime: { $gte: startTime }
  });

  if (appointmentsCount >= availability.maxPatient) {
    return { available: false, message: "Max patients limit exceeded" };
  }

  return { available: true, message: "Slot is available" };
};

export default checkSlotAvailability;
