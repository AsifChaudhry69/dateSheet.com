import { useMutation } from "@tanstack/react-query";
import {
  updateCourses,
  UpdateCoursesResponse,
  CoursePayload,
} from "@/src/api/course";

export function useUpdateCourses() {
  return useMutation<
    UpdateCoursesResponse,
    Error,
    { courses: CoursePayload[] }
  >({
    mutationFn: (payload) => updateCourses(payload),
  });
}
