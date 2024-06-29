"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minutesToTime = exports.timeToMinutes = void 0;
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};
exports.timeToMinutes = timeToMinutes;
const minutesToTime = (minutes) => {
    const minutesNumber = Number(minutes);
    const hours = String(Math.floor(minutesNumber / 60)).padStart(2, "0");
    const mins = String(minutesNumber % 60).padStart(2, "0");
    return `${hours}:${mins}`;
};
exports.minutesToTime = minutesToTime;
