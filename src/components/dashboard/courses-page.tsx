"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookOpen, Pencil, Trash2, Loader2, X } from "lucide-react";
import { useCourses, useUpdateCourse, useDeleteCourse } from "@/src/services/use-course";
import type { CourseResponse } from "@/src/api/course";

export function CoursesPage() {
  const { data: courses, isLoading, error } = useCourses();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  const [editingCourse, setEditingCourse] = useState<CourseResponse | null>(null);
  const [editForm, setEditForm] = useState({
    courseName: "",
    totalStudents: 0,
    freshSemesters: "",
    repeatSemesters: "",
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openEdit = (course: CourseResponse) => {
    setEditingCourse(course);
    setEditForm({
      courseName: course.courseName,
      totalStudents: course.totalStudents,
      freshSemesters: course.freshSemesters.join(", "),
      repeatSemesters: course.repeatSemesters.join(", "),
    });
  };

  const closeEdit = () => {
    setEditingCourse(null);
  };

  const handleEditSave = () => {
    if (!editingCourse) return;

    const freshSems = editForm.freshSemesters
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0);

    const repeatSems = editForm.repeatSemesters
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0);

    updateMutation.mutate(
      {
        id: editingCourse.id,
        data: {
          courseName: editForm.courseName,
          totalStudents: editForm.totalStudents,
          freshSemesters: freshSems,
          repeatSemesters: repeatSems,
        },
      },
      { onSuccess: () => closeEdit() },
    );
  };

  const handleDelete = (id: string) => {
    setDeletingId(null);
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-red-500">Failed to load courses. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Courses</h1>
        <p className="text-muted-foreground">
          Manage your courses. Upload new courses from the Update Courses page.
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            All Courses ({courses?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!courses || courses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium mb-2">No courses yet</p>
              <p className="text-sm">
                Upload courses from the{" "}
                <button
                  onClick={() => {/* parent handles navigation */}}
                  className="text-primary underline hover:no-underline"
                >
                  Update Courses
                </button>{" "}
                page.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground w-12">#</TableHead>
                    <TableHead className="text-muted-foreground">Course Code</TableHead>
                    <TableHead className="text-muted-foreground">Course Name</TableHead>
                    <TableHead className="text-muted-foreground">Students</TableHead>
                    <TableHead className="text-muted-foreground">Fresh Semesters</TableHead>
                    <TableHead className="text-muted-foreground">Repeat Semesters</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course, index) => (
                    <TableRow
                      key={course.id}
                      className="border-border hover:bg-secondary/50"
                    >
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell>
                        <code className="bg-secondary px-2 py-1 rounded text-primary text-sm font-mono">
                          {course.courseCode}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {course.courseName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {course.totalStudents}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {course.freshSemesters.join(", ")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {course.repeatSemesters.join(", ")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(course)}
                            className="border-border hover:bg-primary hover:text-primary-foreground"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog
                            open={deletingId === course.id}
                            onOpenChange={(open) => {
                              if (!open) setDeletingId(null);
                            }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingId(course.id)}
                              className="border-border text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <strong>{course.courseName}</strong> (
                                  {course.courseCode})? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={() => setDeletingId(null)}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(course.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                  ) : null}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeEdit}
          />
          <div className="relative z-10 w-full max-w-md mx-4">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-card-foreground">
                  Edit Course
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeEdit}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseCode">Course Code</Label>
                  <Input
                    id="courseCode"
                    value={editingCourse.courseCode}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    value={editForm.courseName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, courseName: e.target.value })
                    }
                    placeholder="Course name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalStudents">Total Students</Label>
                  <Input
                    id="totalStudents"
                    type="number"
                    min={0}
                    value={editForm.totalStudents}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        totalStudents: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freshSemesters">
                    Fresh Semesters (comma-separated)
                  </Label>
                  <Input
                    id="freshSemesters"
                    value={editForm.freshSemesters}
                    onChange={(e) =>
                      setEditForm({ ...editForm, freshSemesters: e.target.value })
                    }
                    placeholder="e.g. 1, 2, 3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repeatSemesters">
                    Repeat Semesters (comma-separated)
                  </Label>
                  <Input
                    id="repeatSemesters"
                    value={editForm.repeatSemesters}
                    onChange={(e) =>
                      setEditForm({ ...editForm, repeatSemesters: e.target.value })
                    }
                    placeholder="e.g. 4, 5, 6"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={closeEdit}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditSave}
                    disabled={updateMutation.isPending}
                    className="bg-primary text-primary-foreground"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : null}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
