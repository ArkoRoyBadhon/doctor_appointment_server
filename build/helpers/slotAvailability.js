"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appointment_model_1 = __importDefault(require("../models/appointment.model"));
const doctor_model_1 = __importDefault(require("../models/doctor.model"));
const checkSlotAvailability = (doctorId, appointmentDate, startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.default.findById(doctorId);
    if (!doctor) {
        return { available: false, message: "Doctor not found" };
    }
    const dayOfWeek = appointmentDate.toLocaleString('en-us', { weekday: 'long' });
    const availability = doctor.availability.find(avail => avail.day === dayOfWeek);
    if (!availability) {
        return { available: false, message: "Doctor is not available on this day" };
    }
    const isTimeValid = startTime >= availability.startTime && endTime <= availability.endTime;
    if (!isTimeValid) {
        return { available: false, message: "Time slot is not within doctor's availability" };
    }
    const appointmentsCount = yield appointment_model_1.default.countDocuments({
        doctor: doctorId,
        appointmentDate: appointmentDate.toISOString().split("T")[0],
        startTime: { $lte: endTime },
        endTime: { $gte: startTime }
    });
    if (appointmentsCount >= availability.maxPatient) {
        return { available: false, message: "Max patients limit exceeded" };
    }
    return { available: true, message: "Slot is available" };
});
exports.default = checkSlotAvailability;
