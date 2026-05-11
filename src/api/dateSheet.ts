import { api } from "./axios";

export type GenerateDateSheetPayload = {
  title: string;
  startDate: string;
  endDate: string;
  slotsPerDay: number;
  slotDuration: number;
  breakDuration: number;
  dayStartTime: string;
  dayEndTime: string;
  totalRooms: number;
  studentsPerRoom: number;
};

export type RoomDetail = {
  room: number;
  courseCode: string;
  courseName: string;
  students: number;
};

export type DateSheetSemesterEntry = {
  examDate: string;
  slotNumber: number;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  totalStudents: number;
  status: "Fresh" | "Repeater";
  rooms: RoomDetail[];
};

export type GenerateDateSheetResponse = {
  success: boolean;
  message: string;
  data: {
    examPlanId: string;
    title: string;
    summary: {
      totalCourses: number;
      scheduled: number;
      unscheduled: number;
      totalDays: number;
      coursesPerDay: Record<string, number>;
    };
    dateSheetBySemester: Record<string, DateSheetSemesterEntry[]>;
    unscheduled: Array<Record<string, unknown>>;
  } | null;
};

export const generateDateSheet = async (
  payload: GenerateDateSheetPayload,
): Promise<GenerateDateSheetResponse> => {
  const response = await api.post<GenerateDateSheetResponse>(
    "/dashboard/dateSheet",
    payload,
  );
  return response.data;
};
