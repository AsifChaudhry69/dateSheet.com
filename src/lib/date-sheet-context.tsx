"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { DateSheet } from "./types";

// Sample data for demonstration
const sampleDateSheets: DateSheet[] = [
  {
    id: "sample-1",
    title: "Fall 2024 End Semester Examination",
    semester: "all",
    startDate: "2024-12-01",
    endDate: "2024-12-20",
    slotsPerDay: 2,
    slotTime: "09:00 AM - 12:00 PM",
    numberOfRooms: 10,
    studentsPerRoom: 30,
    createdAt: "2024-11-15",
    exams: [
      // Semester 1
      { courseName: "Engineering Mathematics I", courseCode: "MA101", semester: 1, date: "Dec 01, 2024", day: "Monday", time: "09:00 AM - 12:00 PM", students: 120 },
      { courseName: "Engineering Physics", courseCode: "PH101", semester: 1, date: "Dec 03, 2024", day: "Wednesday", time: "09:00 AM - 12:00 PM", students: 120 },
      { courseName: "Engineering Chemistry", courseCode: "CH101", semester: 1, date: "Dec 05, 2024", day: "Friday", time: "09:00 AM - 12:00 PM", students: 120 },
      { courseName: "Basic Electrical Engineering", courseCode: "EE101", semester: 1, date: "Dec 07, 2024", day: "Saturday", time: "09:00 AM - 12:00 PM", students: 120 },
      // Semester 2
      { courseName: "Engineering Mathematics II", courseCode: "MA102", semester: 2, date: "Dec 01, 2024", day: "Monday", time: "02:00 PM - 05:00 PM", students: 115 },
      { courseName: "Programming in C", courseCode: "CS101", semester: 2, date: "Dec 03, 2024", day: "Wednesday", time: "02:00 PM - 05:00 PM", students: 115 },
      { courseName: "Engineering Graphics", courseCode: "ME101", semester: 2, date: "Dec 05, 2024", day: "Friday", time: "02:00 PM - 05:00 PM", students: 115 },
      { courseName: "Environmental Studies", courseCode: "ES101", semester: 2, date: "Dec 07, 2024", day: "Saturday", time: "02:00 PM - 05:00 PM", students: 115 },
      // Semester 3
      { courseName: "Data Structures", courseCode: "CS201", semester: 3, date: "Dec 02, 2024", day: "Tuesday", time: "09:00 AM - 12:00 PM", students: 100 },
      { courseName: "Digital Logic Design", courseCode: "EC201", semester: 3, date: "Dec 04, 2024", day: "Thursday", time: "09:00 AM - 12:00 PM", students: 100 },
      { courseName: "Discrete Mathematics", courseCode: "MA201", semester: 3, date: "Dec 06, 2024", day: "Saturday", time: "09:00 AM - 12:00 PM", students: 100 },
      { courseName: "Object Oriented Programming", courseCode: "CS202", semester: 3, date: "Dec 09, 2024", day: "Monday", time: "09:00 AM - 12:00 PM", students: 100 },
      // Semester 4
      { courseName: "Operating Systems", courseCode: "CS301", semester: 4, date: "Dec 02, 2024", day: "Tuesday", time: "02:00 PM - 05:00 PM", students: 95 },
      { courseName: "Database Management Systems", courseCode: "CS302", semester: 4, date: "Dec 04, 2024", day: "Thursday", time: "02:00 PM - 05:00 PM", students: 95 },
      { courseName: "Computer Organization", courseCode: "CS303", semester: 4, date: "Dec 06, 2024", day: "Saturday", time: "02:00 PM - 05:00 PM", students: 95 },
      { courseName: "Probability & Statistics", courseCode: "MA301", semester: 4, date: "Dec 09, 2024", day: "Monday", time: "02:00 PM - 05:00 PM", students: 95 },
      // Semester 5
      { courseName: "Computer Networks", courseCode: "CS401", semester: 5, date: "Dec 10, 2024", day: "Tuesday", time: "09:00 AM - 12:00 PM", students: 90 },
      { courseName: "Software Engineering", courseCode: "CS402", semester: 5, date: "Dec 12, 2024", day: "Thursday", time: "09:00 AM - 12:00 PM", students: 90 },
      { courseName: "Theory of Computation", courseCode: "CS403", semester: 5, date: "Dec 14, 2024", day: "Saturday", time: "09:00 AM - 12:00 PM", students: 90 },
      { courseName: "Microprocessors", courseCode: "EC401", semester: 5, date: "Dec 16, 2024", day: "Monday", time: "09:00 AM - 12:00 PM", students: 90 },
      // Semester 6
      { courseName: "Compiler Design", courseCode: "CS501", semester: 6, date: "Dec 10, 2024", day: "Tuesday", time: "02:00 PM - 05:00 PM", students: 85 },
      { courseName: "Artificial Intelligence", courseCode: "CS502", semester: 6, date: "Dec 12, 2024", day: "Thursday", time: "02:00 PM - 05:00 PM", students: 85 },
      { courseName: "Web Technologies", courseCode: "CS503", semester: 6, date: "Dec 14, 2024", day: "Saturday", time: "02:00 PM - 05:00 PM", students: 85 },
      { courseName: "Information Security", courseCode: "CS504", semester: 6, date: "Dec 16, 2024", day: "Monday", time: "02:00 PM - 05:00 PM", students: 85 },
      // Semester 7
      { courseName: "Machine Learning", courseCode: "CS601", semester: 7, date: "Dec 11, 2024", day: "Wednesday", time: "09:00 AM - 12:00 PM", students: 80 },
      { courseName: "Cloud Computing", courseCode: "CS602", semester: 7, date: "Dec 13, 2024", day: "Friday", time: "09:00 AM - 12:00 PM", students: 80 },
      { courseName: "Big Data Analytics", courseCode: "CS603", semester: 7, date: "Dec 17, 2024", day: "Tuesday", time: "09:00 AM - 12:00 PM", students: 80 },
      { courseName: "Internet of Things", courseCode: "CS604", semester: 7, date: "Dec 19, 2024", day: "Thursday", time: "09:00 AM - 12:00 PM", students: 80 },
      // Semester 8
      { courseName: "Deep Learning", courseCode: "CS701", semester: 8, date: "Dec 11, 2024", day: "Wednesday", time: "02:00 PM - 05:00 PM", students: 75 },
      { courseName: "Blockchain Technology", courseCode: "CS702", semester: 8, date: "Dec 13, 2024", day: "Friday", time: "02:00 PM - 05:00 PM", students: 75 },
      { courseName: "Natural Language Processing", courseCode: "CS703", semester: 8, date: "Dec 17, 2024", day: "Tuesday", time: "02:00 PM - 05:00 PM", students: 75 },
      { courseName: "Computer Vision", courseCode: "CS704", semester: 8, date: "Dec 19, 2024", day: "Thursday", time: "02:00 PM - 05:00 PM", students: 75 },
    ],
  },
  {
    id: "sample-2",
    title: "Spring 2024 Mid-Term Examination",
    semester: "3",
    startDate: "2024-03-15",
    endDate: "2024-03-25",
    slotsPerDay: 2,
    slotTime: "10:00 AM - 01:00 PM",
    numberOfRooms: 8,
    studentsPerRoom: 25,
    createdAt: "2024-03-01",
    exams: [
      { courseName: "Data Structures", courseCode: "CS201", semester: 3, date: "Mar 15, 2024", day: "Friday", time: "10:00 AM - 01:00 PM", students: 100 },
      { courseName: "Digital Logic Design", courseCode: "EC201", semester: 3, date: "Mar 17, 2024", day: "Sunday", time: "10:00 AM - 01:00 PM", students: 100 },
      { courseName: "Discrete Mathematics", courseCode: "MA201", semester: 3, date: "Mar 19, 2024", day: "Tuesday", time: "10:00 AM - 01:00 PM", students: 100 },
      { courseName: "Object Oriented Programming", courseCode: "CS202", semester: 3, date: "Mar 21, 2024", day: "Thursday", time: "10:00 AM - 01:00 PM", students: 100 },
      { courseName: "Computer Architecture", courseCode: "CS203", semester: 3, date: "Mar 23, 2024", day: "Saturday", time: "10:00 AM - 01:00 PM", students: 100 },
    ],
  },
  {
    id: "sample-3",
    title: "Summer 2024 Supplementary Examination",
    semester: "5",
    startDate: "2024-07-01",
    endDate: "2024-07-10",
    slotsPerDay: 1,
    slotTime: "09:00 AM - 12:00 PM",
    numberOfRooms: 5,
    studentsPerRoom: 20,
    createdAt: "2024-06-15",
    exams: [
      { courseName: "Computer Networks", courseCode: "CS401", semester: 5, date: "Jul 01, 2024", day: "Monday", time: "09:00 AM - 12:00 PM", students: 45 },
      { courseName: "Software Engineering", courseCode: "CS402", semester: 5, date: "Jul 03, 2024", day: "Wednesday", time: "09:00 AM - 12:00 PM", students: 38 },
      { courseName: "Theory of Computation", courseCode: "CS403", semester: 5, date: "Jul 05, 2024", day: "Friday", time: "09:00 AM - 12:00 PM", students: 42 },
      { courseName: "Microprocessors", courseCode: "EC401", semester: 5, date: "Jul 08, 2024", day: "Monday", time: "09:00 AM - 12:00 PM", students: 35 },
    ],
  },
];

interface DateSheetContextType {
  dateSheets: DateSheet[];
  addDateSheet: (sheet: DateSheet) => void;
  deleteDateSheet: (id: string) => void;
  getDateSheetById: (id: string) => DateSheet | undefined;
  selectedDateSheet: DateSheet | null;
  setSelectedDateSheet: (sheet: DateSheet | null) => void;
}

const DateSheetContext = createContext<DateSheetContextType | undefined>(
  undefined
);

export function DateSheetProvider({ children }: { children: ReactNode }) {
  const [dateSheets, setDateSheets] = useState<DateSheet[]>(sampleDateSheets);
  const [selectedDateSheet, setSelectedDateSheet] = useState<DateSheet | null>(
    null
  );

  const addDateSheet = useCallback((sheet: DateSheet) => {
    setDateSheets((prev) => [...prev, sheet]);
  }, []);

  const deleteDateSheet = useCallback((id: string) => {
    setDateSheets((prev) => prev.filter((sheet) => sheet.id !== id));
  }, []);

  const getDateSheetById = useCallback(
    (id: string) => {
      return dateSheets.find((sheet) => sheet.id === id);
    },
    [dateSheets]
  );

  return (
    <DateSheetContext.Provider
      value={{
        dateSheets,
        addDateSheet,
        deleteDateSheet,
        getDateSheetById,
        selectedDateSheet,
        setSelectedDateSheet,
      }}
    >
      {children}
    </DateSheetContext.Provider>
  );
}

export function useDateSheets() {
  const context = useContext(DateSheetContext);
  if (context === undefined) {
    throw new Error("useDateSheets must be used within a DateSheetProvider");
  }
  return context;
}