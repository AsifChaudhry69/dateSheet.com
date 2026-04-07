"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileSpreadsheet, Loader2, CheckCircle } from "lucide-react";
import { useDateSheets } from "@/src/lib/date-sheet-context";
import { DateSheet, ExamSlot, CourseData } from "@/src/lib/types";
import * as XLSX from "xlsx";

interface GeneratePageProps {
  onNavigate: (tab: string) => void;
}

export function GeneratePage({ onNavigate }: GeneratePageProps) {
  const { addDateSheet } = useDateSheets();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    semester: "",
    startDate: "",
    endDate: "",
    slotsPerDay: 2,
    slotTime: "09:00 AM - 12:00 PM",
    numberOfRooms: 10,
    studentsPerRoom: 30,
  });

  const slotTimeOptions = [
    "09:00 AM - 12:00 PM",
    "02:00 PM - 05:00 PM",
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (
      file &&
      (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))
    ) {
      setUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
              fresherSemester: Number(r["Fresher Semester"] || r["fresherSemester"] || 1),
              repeaterSemester: Number(r["Repeater Semester"] || r["repeaterSemester"] || 1),
              numberOfStudents: Number(r["Number of Students"] || r["numberOfStudents"] || 0),
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

  const generateDateSheet = (
    courses: CourseData[],
    startDate: Date,
    endDate: Date,
    slotsPerDay: number,
    slotTime: string
  ): ExamSlot[] => {
    const exams: ExamSlot[] = [];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    let currentDate = new Date(startDate);
    let slotIndex = 0;
    const slotTimes = slotTime.includes("09:00 AM - 12:00 PM") 
      ? ["09:00 AM - 12:00 PM", "02:00 PM - 05:00 PM"]
      : [slotTime];

    for (const course of courses) {
      // Skip weekends
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (currentDate > endDate) {
        currentDate = new Date(startDate);
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      exams.push({
        courseName: course.courseName,
        courseCode: course.courseCode,
        date: currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        day: days[currentDate.getDay()],
        time: slotTimes[slotIndex % slotTimes.length],
        semester: course.fresherSemester,
      });

      slotIndex++;
      if (slotIndex >= slotsPerDay) {
        slotIndex = 0;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return exams;
  };

  const handleGenerate = async () => {
    if (!uploadedFile || !formData.title || !formData.startDate || !formData.endDate) {
      return;
    }

    setIsGenerating(true);

    try {
      const courses = await parseExcelFile(uploadedFile);
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      const exams = generateDateSheet(
        courses,
        startDate,
        endDate,
        formData.slotsPerDay,
        formData.slotTime
      );

      const newDateSheet: DateSheet = {
        id: crypto.randomUUID(),
        title: formData.title,
        semester: formData.semester,
        createdAt: new Date().toISOString(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        slotsPerDay: formData.slotsPerDay,
        slotTime: formData.slotTime,
        numberOfRooms: formData.numberOfRooms,
        studentsPerRoom: formData.studentsPerRoom,
        exams,
      };

      addDateSheet(newDateSheet);

      // Reset form
      setUploadedFile(null);
      setFormData({
        title: "",
        semester: "",
        startDate: "",
        endDate: "",
        slotsPerDay: 2,
        slotTime: "09:00 AM - 12:00 PM",
        numberOfRooms: 10,
        studentsPerRoom: 30,
      });

      // Navigate to list page
      onNavigate("list");
    } catch (error) {
      console.error("Error generating date sheet:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Generate Date Sheet
        </h1>
        <p className="text-muted-foreground">
          Upload your Excel file and configure exam settings
        </p>
      </div>

      <div className="grid gap-6">
        {/* File Upload */}
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
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Exam Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Fall 2024 Final Exams"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester" className="text-foreground">
                  Semester
                </Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, semester: value })
                  }
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-foreground">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-foreground">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slotsPerDay" className="text-foreground">
                  Slots Per Day
                </Label>
                <Select
                  value={formData.slotsPerDay.toString()}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, slotsPerDay: parseInt(value) })
                  }
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "slot" : "slots"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slotTime" className="text-foreground">
                  Slot Time
                </Label>
                <Select
                  value={formData.slotTime}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, slotTime: value })
                  }
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {slotTimeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfRooms" className="text-foreground">
                  Number of Rooms
                </Label>
                <Input
                  id="numberOfRooms"
                  type="number"
                  min={1}
                  value={formData.numberOfRooms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfRooms: parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentsPerRoom" className="text-foreground">
                  Students Per Room
                </Label>
                <Input
                  id="studentsPerRoom"
                  type="number"
                  min={1}
                  value={formData.studentsPerRoom}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      studentsPerRoom: parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={handleGenerate}
                disabled={
                  !uploadedFile ||
                  !formData.title ||
                  !formData.startDate ||
                  !formData.endDate ||
                  isGenerating
                }
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Date Sheet"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
