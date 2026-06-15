import { api } from "./axios";

export type CoursePayload = {
  courseCode: string;
  courseName: string;
  totalStudents: number;
  freshSemesters: number[];
  repeatSemesters: number[];
};

export type CourseResponse = {
  id: string;
  courseCode: string;
  courseName: string;
  totalStudents: number;
  freshSemesters: number[];
  repeatSemesters: number[];
  userId: string;
  createdAt: string;
  updatedAt: string;
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

export type CoursesListResponse = {
  success: boolean;
  message: string;
  data: {
    courses: CourseResponse[];
    total: number;
  } | null;
};

export type SingleCourseResponse = {
  success: boolean;
  message: string;
  data: {
    course: CourseResponse;
  } | null;
};

export const getCourses = async (): Promise<CourseResponse[]> => {
  const response = await api.get<CoursesListResponse>("/dashboard/course");
  return response.data.data?.courses ?? [];
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

export const updateCourse = async (
  id: string,
  payload: {
    courseName: string;
    totalStudents: number;
    freshSemesters: number[];
    repeatSemesters: number[];
  },
): Promise<SingleCourseResponse> => {
  const response = await api.patch<SingleCourseResponse>(
    `/dashboard/course/${id}`,
    payload,
  );
  return response.data;
};

export const deleteCourse = async (id: string): Promise<{ success: boolean; message: string; data: null }> => {
  const response = await api.delete<{ success: boolean; message: string; data: null }>(
    `/dashboard/course/${id}`,
  );
  return response.data;
};
