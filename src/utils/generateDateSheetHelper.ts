export function generateExamDates(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// generate slot time strings for a day
export function generateSlotTimes(
  dayStartTime: string,
  slotsPerDay: number,
  slotDuration: number,
  breakDuration: number
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = dayStartTime.split(":").map(Number);
  let currentMinutes = startHour * 60 + startMin;

  for (let i = 0; i < slotsPerDay; i++) {
    const startH = Math.floor(currentMinutes / 60).toString().padStart(2, "0");
    const startM = (currentMinutes % 60).toString().padStart(2, "0");
    currentMinutes += slotDuration;
    const endH = Math.floor(currentMinutes / 60).toString().padStart(2, "0");
    const endM = (currentMinutes % 60).toString().padStart(2, "0");
    slots.push(`${startH}:${startM} - ${endH}:${endM}`);
    currentMinutes += breakDuration;
  }
  return slots;
}

export function hasConflict(semA: number[], semB: number[]): boolean {
  const setA = new Set(semA);
  return semB.some((s) => setA.has(s));
}

// calculate rooms needed
export function calcRooms(
  totalStudents: number,
  studentsPerRoom: number,
  totalRooms: number
): number[] {
  const count = Math.min(
    Math.ceil(totalStudents / studentsPerRoom),
    totalRooms
  );
  return Array.from({ length: count }, (_, i) => i + 1);
}