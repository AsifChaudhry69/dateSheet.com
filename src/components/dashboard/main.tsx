"use client";

import { useState } from "react";
import { Sidebar } from "./side-bar";
import { InstructionsPage } from "./instructions-page";
import { GeneratePage } from "./generate";
import { GenerateDateSheetPage } from "./generate-date-sheet";
import { ListPage } from "./list-page";
import { ViewPage } from "./view-page";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("instructions");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "instructions":
        return <InstructionsPage />;
      case "update-courses":
        return <GeneratePage />;
      case "generate-date-sheet":
        return <GenerateDateSheetPage />;
      case "list":
        return <ListPage onNavigate={handleTabChange} />;
      case "view":
        return <ViewPage onNavigate={handleTabChange} />;
      default:
        return <InstructionsPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}
