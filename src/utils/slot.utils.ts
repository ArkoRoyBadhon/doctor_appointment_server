export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: string | number) => {
  const minutesNumber = Number(minutes);
  const hours = String(Math.floor(minutesNumber / 60)).padStart(2, "0");
  const mins = String(minutesNumber % 60).padStart(2, "0");
  return `${hours}:${mins}`;
};
