import mongoose from 'mongoose';
import Doctor from '../models/doctor.model.js';

export async function checkSlotAvailability(doctorId, date, time) {
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });

  const doctor = await Doctor.findById(doctorId).populate('appointments');
  if (!doctor) {
    throw new Error('Doctor not found');
  }

  const availability = doctor.availability.find((slot) => slot.day === dayOfWeek);
  if (!availability) {
    return { available: false, message: 'No availability found for the selected day' };
  }

  console.log("doctor", doctor);
  
  const appointmentsOnDate = doctor.appointments.filter((appointment) => {
    return appointment.date.toISOString().split('T')[0] === date.toISOString().split('T')[0] && appointment.time === time;
  });

  if (appointmentsOnDate.length >= availability.maxPatient) {
    return { available: false, message: 'Slot is fully booked' };
  }

  return { available: true, message: 'Slot is available' };
}
