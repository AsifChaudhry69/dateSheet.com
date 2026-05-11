import { api } from "./axios";
import { DateSheetSemesterEntry } from "./dateSheet";

export interface ExamPlanSummary {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  slotsPerDay: number;
  totalRooms: number;
  studentsPerRoom: number;
  createdAt: string;
  totalDateSheets: number;
}

export type GetExamPlansResponse = {
  success: boolean;
  message: string;
  data: {
    examPlans: ExamPlanSummary[];
  } | null;
};

export type DateSheetResponse = {
  success: boolean;
  message: string;
  data: {
    examPlan: {
      id: string;
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
      createdAt: string;
    };
    dateSheetBySemester: Record<string, DateSheetSemesterEntry[]>;
    totalCourses: number;
  } | null;
};

export const getExamPlans = async (): Promise<ExamPlanSummary[]> => {
  const response = await api.get<GetExamPlansResponse>("/dashboard/examPlans");
  return response.data.data?.examPlans ?? [];
};

export const getDateSheetByExamPlan = async (
  examPlanId: string,
): Promise<DateSheetResponse["data"]> => {
  const response = await api.get<DateSheetResponse>(
    `/dashboard/dateSheet?examPlanId=${encodeURIComponent(examPlanId)}`,
  );

  if (!response.data.data) {
    throw new Error(response.data.message || "Unable to load date sheet");
  }

  return response.data.data;
};
