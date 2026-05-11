export type Slot = {
  date: Date;
  dateKey: string;     
  slotIndex: number;
  slotTime: string;
};

export type ScheduledCourse = {
  courseId: string;
  courseCode: string;
  courseName: string;
  totalStudents: number;
  allSemesters: number[];
  examDate: Date;
  slotNumber: number;
  slotTime: string;
  roomNumbers: number[];
};