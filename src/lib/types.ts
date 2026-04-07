export interface CourseData {
  courseName: string;
  courseCode: string;
  fresherSemester: number;
  repeaterSemester: number;
  numberOfStudents: number;
}

export interface ExamSlot {
  courseName: string;
  courseCode: string;
  date: string;
  day: string;
  time: string;
  semester: number;
}

export interface DateSheet {
  id: string;
  title: string;
  semester: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  slotsPerDay: number;
  slotTime: string;
  numberOfRooms: number;
  studentsPerRoom: number;
  exams: ExamSlot[];
}

export interface GenerateFormData {
  file: File | null;
  title: string;
  semester: string;
  startDate: string;
  endDate: string;
  slotsPerDay: number;
  slotTime: string;
  numberOfRooms: number;
  studentsPerRoom: number;
}
