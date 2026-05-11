import { api } from "./axios";

export type CoursePayload = {
  courseCode: string;
  courseName: string;
  totalStudents: number;
  freshSemesters: number[];
  repeatSemesters: number[];
};

export type UpdateCoursesResponse = {
  success: boolean;
  message: string;
  data: {
    created: number;
    updated: number;
    total: number;
  } | null;
};

export const updateCourses = async (payload: {
  courses: CoursePayload[];
}): Promise<UpdateCoursesResponse> => {
  const response = await api.post<UpdateCoursesResponse>(
    "/dashboard/course",
    payload,
  );

  return response.data;
};
