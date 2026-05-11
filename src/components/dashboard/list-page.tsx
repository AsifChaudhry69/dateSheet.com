"use client";

import { useEffect, useState } from "react";
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
import { Eye, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useDateSheets } from "@/src/lib/date-sheet-context";
import {
  getExamPlans,
  getDateSheetByExamPlan,
  ExamPlanSummary,
} from "@/src/api/examPlan";
import { DateSheet } from "@/src/lib/types";

interface ListPageProps {
  onNavigate: (tab: string) => void;
}

export function ListPage({ onNavigate }: ListPageProps) {
  const { setSelectedDateSheet } = useDateSheets();
  const [examPlans, setExamPlans] = useState<ExamPlanSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadExamPlans = async () => {
      setIsLoading(true);
      try {
        const plans = await getExamPlans();
        if (!cancelled) {
          setExamPlans(plans);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to load exam plans");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadExamPlans();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleView = async (examPlanId: string) => {
    setLoadingPlanId(examPlanId);
    try {
      const data = await getDateSheetByExamPlan(examPlanId);
      if (!data) {
        toast.error("Date sheet data could not be loaded.");
        return;
      }

      const exams = Object.entries(data.dateSheetBySemester).flatMap(
        ([semesterKey, entries]) => {
          const semester = Number(semesterKey.replace("semester", ""));
          return entries.map((entry) => ({
            courseName: entry.courseName,
            courseCode: entry.courseCode,
            date: new Date(entry.examDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            day: new Date(entry.examDate).toLocaleDateString("en-US", {
              weekday: "long",
            }),
            time: `${entry.startTime} - ${entry.endTime}`,
            semester,
            rooms: entry.rooms ?? [],
            status: entry.status,
          }));
        },
      );

      const selected: DateSheet = {
        id: data.examPlan.id,
        title: data.examPlan.title,
        semester: "all",
        createdAt: data.examPlan.createdAt,
        startDate: data.examPlan.startDate,
        endDate: data.examPlan.endDate,
        slotsPerDay: data.examPlan.slotsPerDay,
        slotTime: `${data.examPlan.dayStartTime} - ${data.examPlan.dayEndTime}`,
        numberOfRooms: data.examPlan.totalRooms,
        studentsPerRoom: data.examPlan.studentsPerRoom,
        exams,
      };

      setSelectedDateSheet(selected);
      onNavigate("view");
    } catch (error: any) {
      toast.error(error?.message || "Failed to load date sheet");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Exam Plans</h1>
        <p className="text-muted-foreground">
          Select an exam plan to view its generated date sheet.
        </p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Exam Plans ({examPlans.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground">
                    Exam Period
                  </TableHead>
                  <TableHead className="text-muted-foreground">Rooms</TableHead>
                  <TableHead className="text-muted-foreground">
                    Students/Room
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Total Slots
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Created
                  </TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Loading exam plans...
                    </TableCell>
                  </TableRow>
                ) : examPlans.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No exam plans found. Generate a new exam plan to get
                      started.
                    </TableCell>
                  </TableRow>
                ) : (
                  examPlans.map((plan) => (
                    <TableRow
                      key={plan.id}
                      className="border-border hover:bg-secondary/50"
                    >
                      <TableCell className="font-medium text-foreground">
                        {plan.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(plan.startDate)} -{" "}
                        {formatDate(plan.endDate)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {plan.totalRooms}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {plan.studentsPerRoom}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {plan.totalDateSheets}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(plan.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(plan.id)}
                          className="border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
                          disabled={loadingPlanId === plan.id}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {loadingPlanId === plan.id ? "Loading..." : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
