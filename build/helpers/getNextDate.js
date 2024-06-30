"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getNextDate = (dayOfWeek) => {
    const daysOfWeekMap = {
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
        daysToAdd += 7;
    }
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    nextDate.setHours(0, 0, 0, 0);
    return nextDate;
};
exports.default = getNextDate;
