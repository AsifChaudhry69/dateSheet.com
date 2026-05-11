"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, BookOpen, Printer } from "lucide-react";
import { useDateSheets } from "@/src/lib/date-sheet-context";
import { ExamSlot } from "@/src/lib/types";

interface ViewPageProps {
  onNavigate: (tab: string) => void;
}

export function ViewPage({ onNavigate }: ViewPageProps) {
  const { selectedDateSheet } = useDateSheets();

  if (!selectedDateSheet) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <Calendar className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Date Sheet Selected
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Please select a date sheet from the list to view its details.
            </p>
            <Button
              onClick={() => onNavigate("list")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              View All Date Sheets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group exams by semester
  const examsBySemester: Record<number, ExamSlot[]> = {};
  selectedDateSheet.exams.forEach((exam) => {
    if (!examsBySemester[exam.semester]) {
      examsBySemester[exam.semester] = [];
    }
    examsBySemester[exam.semester].push(exam);
  });

  // Sort semesters
  const sortedSemesters = Object.keys(examsBySemester)
    .map(Number)
    .sort((a, b) => a - b);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate("list")}
            className="border-border hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {selectedDateSheet.title}
            </h1>
            <p className="text-muted-foreground">
              {selectedDateSheet.semester === "all"
                ? "All Semesters"
                : `Semester ${selectedDateSheet.semester}`}{" "}
              | {selectedDateSheet.exams.length} exams scheduled
            </p>
          </div>
        </div>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="border-border hover:bg-primary hover:text-primary-foreground hover:border-primary print:hidden"
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Overview Card */}
      <Card className="bg-card border-border mb-6 print:hidden">
        <CardContent className="py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exam Period</p>
                <p className="text-foreground font-medium">
                  {new Date(selectedDateSheet.startDate).toLocaleDateString()} -{" "}
                  {new Date(selectedDateSheet.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slots Per Day</p>
                <p className="text-foreground font-medium">
                  {selectedDateSheet.slotsPerDay} slots
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rooms</p>
                <p className="text-foreground font-medium">
                  {selectedDateSheet.numberOfRooms} rooms
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Students/Room</p>
                <p className="text-foreground font-medium">
                  {selectedDateSheet.studentsPerRoom} students
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block mb-8 text-center">
        <h1 className="text-2xl font-bold">{selectedDateSheet.title}</h1>
        <p className="text-gray-600">
          Exam Period:{" "}
          {new Date(selectedDateSheet.startDate).toLocaleDateString()} -{" "}
          {new Date(selectedDateSheet.endDate).toLocaleDateString()}
        </p>
      </div>

      {/* Date Sheets by Semester */}
      <div className="space-y-6">
        {sortedSemesters.map((semester) => (
          <Card
            key={semester}
            className="bg-card border-border print:break-inside-avoid"
          >
            <CardHeader className="bg-secondary/30 border-b border-border">
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  Semester {semester}
                </div>
                <span className="text-muted-foreground text-sm font-normal">
                  ({examsBySemester[semester].length} exams)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      S.No
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Course Name
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Course Code
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground">Day</TableHead>
                    <TableHead className="text-muted-foreground">
                      Time
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Room(s)
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examsBySemester[semester].map((exam, index) => (
                    <TableRow
                      key={`${exam.courseCode}-${index}`}
                      className="border-border hover:bg-secondary/30"
                    >
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {exam.courseName}
                      </TableCell>
                      <TableCell>
                        <code className="bg-secondary px-2 py-1 rounded text-primary text-sm font-mono">
                          {exam.courseCode}
                        </code>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {exam.date}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {exam.day}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-primary">
                          <Clock className="h-3 w-3" />
                          {exam.time}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {exam.rooms?.map((room) => room.room).join(", ") ?? "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            exam.status === "Fresh"
                              ? "text-emerald-600 font-medium"
                              : exam.status === "Repeater"
                                ? "text-orange-600 font-medium"
                                : "text-muted-foreground"
                          }
                        >
                          {exam.status ?? "Unknown"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
