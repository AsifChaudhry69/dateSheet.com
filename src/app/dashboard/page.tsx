"use client";

import { Dashboard } from "@/src/components/dashboard/main";
import { DateSheetProvider } from "@/src/lib/date-sheet-context";

export default function DashboardPage() {
  return (
    <DateSheetProvider>
      <Dashboard />
    </DateSheetProvider>
  );
}