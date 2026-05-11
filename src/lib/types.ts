export interface CourseData {
  courseName: string;
  courseCode: string;
  fresherSemester: number;
  repeaterSemester: number;
  numberOfStudents: number;
}

export interface RoomDetail {
  room: number;
  courseCode: string;
  courseName: string;
  students: number;
}

export interface ExamSlot {
  courseName: string;
  courseCode: string;
  date: string;
  day: string;
  time: string;
  semester: number;
  status?: "Fresh" | "Repeater";
  rooms?: RoomDetail[];
}

export interface DateSheetEntry {
  id: string;
  examPlanId: string;
  courseId: string;
  semester: number;
  date: Date;
  slotNumber: number;
  startTime: string;
  endTime: string;
  rooms: RoomDetail[];
  createdAt: Date;
  updatedAt: Date;
  course: {
    id: string;
    courseCode: string;
    courseName: string;
    totalStudents: number;
    freshSemesters: number[];
    repeatSemesters: number[];
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface ExamPlan {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  slotsPerDay: number;
  slotDuration: number;
  breakDuration: number;
  dayStartTime: string;
  dayEndTime: string;
  totalRooms: number;
  studentsPerRoom: number;
  createdAt: Date;
  updatedAt: Date;
  dateSheets: DateSheetEntry[];
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
