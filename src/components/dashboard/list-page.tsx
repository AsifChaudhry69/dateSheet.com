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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Trash2, FileText, Calendar } from "lucide-react";
import { useDateSheets } from "@/src/lib/date-sheet-context";

interface ListPageProps {
  onNavigate: (tab: string) => void;
}

export function ListPage({ onNavigate }: ListPageProps) {
  const { dateSheets, deleteDateSheet, setSelectedDateSheet } = useDateSheets();

  const handleView = (id: string) => {
    const sheet = dateSheets.find((s) => s.id === id);
    if (sheet) {
      setSelectedDateSheet(sheet);
      onNavigate("view");
    }
  };

  const handleDelete = (id: string) => {
    deleteDateSheet(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Generated Date Sheets
        </h1>
        <p className="text-muted-foreground">
          View and manage all your generated exam date sheets
        </p>
      </div>

      {dateSheets.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <Calendar className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Date Sheets Yet
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              You have not generated any exam date sheets. Upload an Excel file
              and configure your exam settings to get started.
            </p>
            <Button
              onClick={() => onNavigate("generate")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Generate Date Sheet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              All Date Sheets ({dateSheets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">
                      Title
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Semester
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Exam Period
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Total Exams
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
                  {dateSheets.map((sheet) => (
                    <TableRow
                      key={sheet.id}
                      className="border-border hover:bg-secondary/50"
                    >
                      <TableCell className="font-medium text-foreground">
                        {sheet.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {sheet.semester === "all"
                          ? "All Semesters"
                          : `Semester ${sheet.semester}`}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(sheet.startDate)} - {formatDate(sheet.endDate)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {sheet.exams.length} exams
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(sheet.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(sheet.id)}
                            className="border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger >
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-foreground">
                                  Delete Date Sheet
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  Are you sure you want to delete "{sheet.title}"?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-border">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(sheet.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
