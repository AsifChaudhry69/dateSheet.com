"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Table, CheckCircle } from "lucide-react";

export function InstructionsPage() {
  const columns = [
    {
      name: "Course Name",
      description: "Full name of the course (e.g., 'Data Structures and Algorithms')",
      type: "Text",
      required: true,
    },
    {
      name: "Course Code",
      description: "Unique identifier for the course (e.g., 'CS201')",
      type: "Text",
      required: true,
    },
    {
      name: "Fresher Semester",
      description: "Semester number for fresh students taking this course (1-8)",
      type: "Number",
      required: true,
    },
    {
      name: "Repeater Semester",
      description: "Semester number for repeater students (1-8)",
      type: "Number",
      required: true,
    },
    {
      name: "Number of Students",
      description: "Total number of students enrolled in this course",
      type: "Number",
      required: true,
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Excel File Instructions
        </h1>
        <p className="text-muted-foreground">
          Learn how to prepare your Excel file for generating exam date sheets
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                File Format Requirements
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>
                  Upload your file in <strong className="text-foreground">.xlsx</strong> or{" "}
                  <strong className="text-foreground">.xls</strong> format
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>
                  First row should contain column headers exactly as specified below
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>
                  Data should start from the second row
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>
                  Ensure there are no empty rows between data entries
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Table className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                Required Columns
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-foreground font-semibold">
                      Column Name
                    </th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">
                      Data Type
                    </th>
                    <th className="text-left py-3 px-4 text-foreground font-semibold">
                      Required
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map((column, index) => (
                    <tr
                      key={index}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="py-4 px-4">
                        <code className="bg-secondary px-2 py-1 rounded text-primary text-sm font-mono">
                          {column.name}
                        </code>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {column.description}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {column.type}
                      </td>
                      <td className="py-4 px-4">
                        {column.required && (
                          <span className="inline-flex items-center gap-1 text-primary text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Yes
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Example Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto bg-secondary/50 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-primary font-medium">
                      Course Name
                    </th>
                    <th className="text-left py-2 px-3 text-primary font-medium">
                      Course Code
                    </th>
                    <th className="text-left py-2 px-3 text-primary font-medium">
                      Fresher Semester
                    </th>
                    <th className="text-left py-2 px-3 text-primary font-medium">
                      Repeater Semester
                    </th>
                    <th className="text-left py-2 px-3 text-primary font-medium">
                      Number of Students
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3">Data Structures</td>
                    <td className="py-2 px-3">CS201</td>
                    <td className="py-2 px-3">3</td>
                    <td className="py-2 px-3">5</td>
                    <td className="py-2 px-3">120</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 px-3">Database Systems</td>
                    <td className="py-2 px-3">CS301</td>
                    <td className="py-2 px-3">5</td>
                    <td className="py-2 px-3">7</td>
                    <td className="py-2 px-3">95</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Operating Systems</td>
                    <td className="py-2 px-3">CS302</td>
                    <td className="py-2 px-3">5</td>
                    <td className="py-2 px-3">7</td>
                    <td className="py-2 px-3">110</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}