"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  FileSpreadsheet,
  Upload,
  List,
  Eye,
  Info,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    id: "instructions",
    label: "Instructions",
    icon: Info,
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
  },
  {
    id: "update-courses",
    label: "Update Courses",
    icon: Upload,
  },
  {
    id: "generate-date-sheet",
    label: "Generate Date Sheet",
    icon: Calendar,
  },
  {
    id: "list",
    label: "Date Sheets",
    icon: List,
  },
  {
    id: "view",
    label: "View Date Sheet",
    icon: Eye,
  },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">
              dateSheet
            </h1>
            <p className="text-xs text-muted-foreground">.com</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-3 px-4 py-3">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            Exam Scheduling System
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
