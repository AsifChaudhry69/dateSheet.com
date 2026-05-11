"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle, Loader2 } from "lucide-react";
import { useUpdateCourses } from "@/src/services/use-update-courses";
import * as XLSX from "xlsx";

interface CourseData {
  courseName: string;
  courseCode: string;
  fresherSemesters: number[];
  repeaterSemesters: number[];
  numberOfStudents: number;
}

export function GeneratePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { mutate: updateCourses, isPending: isUpdating } = useUpdateCourses();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const parseSemesters = (val: unknown): number[] => {
    if (val === undefined || val === null || val === "") return [1];
    return String(val)
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0);
  };

  const parseExcelFile = async (file: File): Promise<CourseData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const courses: CourseData[] = jsonData.map((row: unknown) => {
            const r = row as Record<string, unknown>;
            return {
              courseName: String(r["Course Name"] || r["courseName"] || ""),
              courseCode: String(r["Course Code"] || r["courseCode"] || ""),
              fresherSemesters: parseSemesters(
                r["Fresh Semesters"] ??
                  r["Fresher Semester"] ??
                  r["fresherSemester"]
              ),
              repeaterSemesters: parseSemesters(
                r["Repeat Semesters"] ??
                  r["Repeater Semester"] ??
                  r["repeaterSemester"]
              ),
              numberOfStudents: Number(
                r["Total Students"] ||
                  r["Number of Students"] ||
                  r["numberOfStudents"] ||
                  0
              ),
            };
          });
          resolve(courses);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpdateCourse = async () => {
    if (!uploadedFile) return;

    try {
      const courses = await parseExcelFile(uploadedFile);
      const apiCourses = courses.map((course) => ({
        courseCode: course.courseCode,
        courseName: course.courseName,
        totalStudents: course.numberOfStudents,
        freshSemesters: course.fresherSemesters,
        repeatSemesters: course.repeaterSemesters,
      }));

      updateCourses(
        { courses: apiCourses },
        {
          onSuccess: (response) => {
            alert(
              `Courses updated successfully! Created: ${response.data?.created ?? 0}, Updated: ${response.data?.updated ?? 0}`
            );
            setUploadedFile(null);
          },
          onError: (error: Error) => {
            console.error("Update courses failed:", error);
            alert(`Update failed: ${error.message}`);
          },
        }
      );
    } catch (error) {
      console.error("Error parsing Excel:", error);
      alert("Error parsing Excel file");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Update Courses
        </h1>
        <p className="text-muted-foreground">
          Upload your Excel file to update courses
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Excel File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {uploadedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <FileSpreadsheet className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      Drop your Excel file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (.xlsx, .xls)
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="mt-8">
              <Button
                onClick={handleUpdateCourse}
                disabled={!uploadedFile || isUpdating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Course"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}