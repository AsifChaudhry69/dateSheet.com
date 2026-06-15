import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourses,
  updateCourse,
  deleteCourse,
  CourseResponse,
} from "@/src/api/course";
import { toast } from "sonner";

export function useCourses() {
  return useQuery<CourseResponse[]>({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        courseName: string;
        totalStudents: number;
        freshSemesters: number[];
        repeatSemesters: number[];
      };
    }) => updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update course");
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete course");
    },
  });
}
