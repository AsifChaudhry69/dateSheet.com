"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useGenerateDateSheet } from "@/src/services/use-generate-date-sheet";
import { GenerateDateSheetPayload } from "@/src/api/dateSheet";

export function GenerateDateSheetPage() {
  const [formData, setFormData] = useState<GenerateDateSheetPayload>({
    title: "",
    startDate: "",
    endDate: "",
    slotsPerDay: 4,
    slotDuration: 90,
    breakDuration: 30,
    dayStartTime: "09:00",
    dayEndTime: "17:00",
    totalRooms: 20,
    studentsPerRoom: 30,
  });

  const { mutate: generateSheet, isPending: isGenerating } =
    useGenerateDateSheet();

  const handleGenerate = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) {
      alert("Please fill in title, start date, and end date.");
      return;
    }

    generateSheet(formData, {
      onSuccess: (response) => {
        if (response.success) {
          alert("Date sheet generated successfully!");
          setFormData({
            title: "",
            startDate: "",
            endDate: "",
            slotsPerDay: 4,
            slotDuration: 90,
            breakDuration: 30,
            dayStartTime: "09:00",
            dayEndTime: "17:00",
            totalRooms: 20,
            studentsPerRoom: 30,
          });
        } else {
          alert(`Generate failed: ${response.message}`);
        }
      },
      onError: (error: Error) => {
        console.error("Generate failed:", error);
        alert(`Generate failed: ${error.message}`);
      },
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Generate Date Sheet
        </h1>
        <p className="text-muted-foreground">
          Configure exam settings and generate the date sheet
        </p>
      </div>

      <div className="grid gap-6">
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
                  placeholder="e.g., June 2024 Exams"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
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
                <Input
                  id="slotsPerDay"
                  type="number"
                  min={1}
                  value={formData.slotsPerDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slotsPerDay: parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slotDuration" className="text-foreground">
                  Slot Duration (minutes)
                </Label>
                <Input
                  id="slotDuration"
                  type="number"
                  min={1}
                  value={formData.slotDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slotDuration: parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breakDuration" className="text-foreground">
                  Break Duration (minutes)
                </Label>
                <Input
                  id="breakDuration"
                  type="number"
                  min={0}
                  value={formData.breakDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      breakDuration: parseInt(e.target.value) || 0,
                    })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dayStartTime" className="text-foreground">
                  Day Start Time
                </Label>
                <Input
                  id="dayStartTime"
                  type="time"
                  value={formData.dayStartTime}
                  onChange={(e) =>
                    setFormData({ ...formData, dayStartTime: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dayEndTime" className="text-foreground">
                  Day End Time
                </Label>
                <Input
                  id="dayEndTime"
                  type="time"
                  value={formData.dayEndTime}
                  onChange={(e) =>
                    setFormData({ ...formData, dayEndTime: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalRooms" className="text-foreground">
                  Total Rooms
                </Label>
                <Input
                  id="totalRooms"
                  type="number"
                  min={1}
                  value={formData.totalRooms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalRooms: parseInt(e.target.value) || 1,
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
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
