/**
 * @swagger
 * /api/datesheet/generate:
 *   post:
 *     summary: Generate conflict-free exam date sheet
 *     tags: [DateSheet]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *               - slotsPerDay
 *               - slotDuration
 *               - breakDuration
 *               - dayStartTime
 *               - dayEndTime
 *               - totalRooms
 *               - studentsPerRoom
 *             properties:
 *               title:
 *                 type: string
 *                 example: "June 2024 Exams"
 *               startDate:
 *                 type: string
 *                 example: "2024-06-03"
 *               endDate:
 *                 type: string
 *                 example: "2024-06-08"
 *               slotsPerDay:
 *                 type: integer
 *                 example: 4
 *               slotDuration:
 *                 type: integer
 *                 example: 90
 *               breakDuration:
 *                 type: integer
 *                 example: 30
 *               dayStartTime:
 *                 type: string
 *                 example: "09:00"
 *               dayEndTime:
 *                 type: string
 *                 example: "17:00"
 *               totalRooms:
 *                 type: integer
 *                 example: 20
 *               studentsPerRoom:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Date sheet generated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "../../../../lib/db";
import { createResponse } from "../../../../utils/createResponse";
import { authOptions } from "../../../../lib/auth";

// ─── Types ───────────────────────────────────────────────────

type Body = {
  title: string;
  startDate: string;
  endDate: string;
  slotsPerDay: number;
  slotDuration: number;
  breakDuration: number;
  dayStartTime: string;
  dayEndTime: string;
  totalRooms: number;
  studentsPerRoom: number;
};

type CourseType = {
  id: string;
  courseCode: string;
  courseName: string;
  totalStudents: number;
  freshSemesters: number[];
  repeatSemesters: number[];
};

type CandidateSlot = {
  date: Date;
  dateKey: string;
  slotNumber: number;
  startTime: string;
  endTime: string;
};

type RoomDetail = {
  room: number;
  courseCode: string;
  courseName: string;
  students: number;
};

type DateSheetEntry = {
  courseId: string;
  semester: number;
  date: Date;
  slotNumber: number;
  startTime: string;
  endTime: string;
  rooms: RoomDetail[];
};

type SemesterEntry = {
  examDate: string;
  slotNumber: number;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseName: string;
  totalStudents: number;
  status: "Fresh" | "Repeater";
  rooms: RoomDetail[];
};

// ─── Helpers ─────────────────────────────────────────────────

function getAllSemesters(course: CourseType): number[] {
  const all = [...course.freshSemesters, ...course.repeatSemesters];
  return [...new Set(all)];
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(total: number): string {
  const h = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const m = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

function buildSlots(
  startDate: Date,
  endDate: Date,
  slotsPerDay: number,
  slotDuration: number,
  breakDuration: number,
  dayStartTime: string,
): CandidateSlot[] {
  const result: CandidateSlot[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      let startMin = timeToMinutes(dayStartTime);
      const dateKey = current.toISOString().split("T")[0];
      for (let slot = 1; slot <= slotsPerDay; slot++) {
        const endMin = startMin + slotDuration;
        result.push({
          date: new Date(current),
          dateKey,
          slotNumber: slot,
          startTime: minutesToTime(startMin),
          endTime: minutesToTime(endMin),
        });
        startMin = endMin + breakDuration;
      }
    }
    current.setDate(current.getDate() + 1);
  }
  return result;
}

// ─── Main Handler ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // ✅ Get logged-in user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        createResponse(false, "Unauthorized", null),
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const body: Body = await req.json();
    const {
      title,
      startDate,
      endDate,
      slotsPerDay,
      slotDuration,
      breakDuration,
      dayStartTime,
      dayEndTime,
      totalRooms,
      studentsPerRoom,
    } = body;

    // ✅ Validate all fields
    if (
      !title ||
      !startDate ||
      !endDate ||
      !slotsPerDay ||
      !slotDuration ||
      !breakDuration ||
      !dayStartTime ||
      !dayEndTime ||
      !totalRooms ||
      !studentsPerRoom
    ) {
      return NextResponse.json(
        createResponse(false, "All fields are required", null),
        { status: 400 },
      );
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        createResponse(false, "endDate must be after startDate", null),
        { status: 400 },
      );
    }

    // ✅ Fetch only the logged-in user's courses
    const courses = (await prisma.course.findMany({
      where: { userId },
      orderBy: { totalStudents: "desc" },
    })) as CourseType[];

    if (!courses.length) {
      return NextResponse.json(
        createResponse(false, "No courses found in database", null),
        { status: 400 },
      );
    }

    // ✅ Build all slots
    const slots = buildSlots(
      new Date(startDate),
      new Date(endDate),
      Number(slotsPerDay),
      Number(slotDuration),
      Number(breakDuration),
      String(dayStartTime),
    );

    const uniqueDays = [...new Set(slots.map((s) => s.dateKey))];

    // ─── Scheduling ───────────────────────────────────────────

    const semesterPerSlot = new Map<string, Set<number>>();
    const semesterPerDay = new Map<string, Map<number, number>>();
    const nextRoomPerSlot = new Map<string, number>();

    const dateSheetEntries: DateSheetEntry[] = [];
    const unscheduled: any[] = [];
    const dateSheetBySemester: Record<string, SemesterEntry[]> = {};

    for (const course of courses) {
      const sems = getAllSemesters(course);
      const needRooms = Math.ceil(
        course.totalStudents / Number(studentsPerRoom),
      );
      let assigned = false;

      for (const slot of slots) {
        const slotKey = `${slot.dateKey}-${slot.slotNumber}`;
        const slotSems = semesterPerSlot.get(slotKey) || new Set<number>();
        const dayMap =
          semesterPerDay.get(slot.dateKey) || new Map<number, number>();
        const nextRoom = nextRoomPerSlot.get(slotKey) || 1;

        let conflict = false;

        // ✅ Rule 1: No semester clash in same slot
        for (const sem of sems) {
          if (slotSems.has(sem)) {
            conflict = true;
            break;
          }
        }
        if (conflict) continue;

        // ✅ Rule 2: Max 2 exams per semester per day
        for (const sem of sems) {
          if ((dayMap.get(sem) || 0) >= 2) {
            conflict = true;
            break;
          }
        }
        if (conflict) continue;

        // ✅ Rule 3: Enough rooms available
        if (nextRoom + needRooms - 1 > Number(totalRooms)) continue;

        // ✅ Assign rooms
        const rooms: RoomDetail[] = Array.from(
          { length: needRooms },
          (_, i) => ({
            room: nextRoom + i,
            courseCode: course.courseCode,
            courseName: course.courseName,
            students: Math.min(
              course.totalStudents - i * Number(studentsPerRoom),
              Number(studentsPerRoom),
            ),
          }),
        );

        // ✅ Update tracking maps
        for (const sem of sems) {
          slotSems.add(sem);
          dayMap.set(sem, (dayMap.get(sem) || 0) + 1);
        }
        semesterPerSlot.set(slotKey, slotSems);
        semesterPerDay.set(slot.dateKey, dayMap);
        nextRoomPerSlot.set(slotKey, nextRoom + needRooms);

        // ✅ Add one entry per semester
        for (const sem of sems) {
          dateSheetEntries.push({
            courseId: course.id,
            semester: sem,
            date: slot.date,
            slotNumber: slot.slotNumber,
            startTime: slot.startTime,
            endTime: slot.endTime,
            rooms,
          });

          const key = `semester${sem}`;
          if (!dateSheetBySemester[key]) {
            dateSheetBySemester[key] = [];
          }

          dateSheetBySemester[key].push({
            examDate: slot.dateKey,
            slotNumber: slot.slotNumber,
            startTime: slot.startTime,
            endTime: slot.endTime,
            courseCode: course.courseCode,
            courseName: course.courseName,
            totalStudents: course.totalStudents,
            status: (course.freshSemesters as number[]).includes(sem)
              ? "Fresh"
              : "Repeater",
            rooms,
          });
        }

        assigned = true;
        break;
      }

      if (!assigned) {
        unscheduled.push({
          courseCode: course.courseCode,
          courseName: course.courseName,
        });
      }
    }

    // ✅ Sort each semester by date then slot
    for (const key of Object.keys(dateSheetBySemester)) {
      dateSheetBySemester[key].sort((a, b) =>
        a.examDate !== b.examDate
          ? a.examDate.localeCompare(b.examDate)
          : a.slotNumber - b.slotNumber,
      );
    }

    // ✅ Sort semesters in order
    const sortedBySemester = Object.keys(dateSheetBySemester)
      .sort(
        (a, b) =>
          parseInt(a.replace("semester", "")) -
          parseInt(b.replace("semester", "")),
      )
      .reduce(
        (acc, key) => {
          acc[key] = dateSheetBySemester[key];
          return acc;
        },
        {} as Record<string, SemesterEntry[]>,
      );

    // ✅ Save ExamPlan AFTER scheduling succeeds — now with userId
    const examPlan = await prisma.examPlan.create({
      data: {
        title: String(title),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        slotsPerDay: Number(slotsPerDay),
        slotDuration: Number(slotDuration),
        breakDuration: Number(breakDuration),
        dayStartTime: String(dayStartTime),
        dayEndTime: String(dayEndTime),
        totalRooms: Number(totalRooms),
        studentsPerRoom: Number(studentsPerRoom),
        user: {
          connect: { id: userId },
        },
      },
    });

    // ✅ Batch save ALL datesheets in ONE query
    await prisma.dateSheet.createMany({
      data: dateSheetEntries.map((e) => ({
        examPlanId: String(examPlan.id),
        courseId: String(e.courseId),
        semester: Number(e.semester),
        date: new Date(e.date),
        slotNumber: Number(e.slotNumber),
        startTime: String(e.startTime),
        endTime: String(e.endTime),
        rooms: e.rooms,
      })),
    });

    // ✅ Courses per day summary
    const coursesPerDay: Record<string, number> = {};
    for (const e of dateSheetEntries) {
      const dateKey = e.date.toISOString().split("T")[0];
      coursesPerDay[dateKey] = (coursesPerDay[dateKey] || 0) + 1;
    }

    return NextResponse.json(
      createResponse(true, "Datesheet generated successfully", {
        examPlanId: examPlan.id,
        title: examPlan.title,
        summary: {
          totalCourses: courses.length,
          scheduled: courses.length - unscheduled.length,
          unscheduled: unscheduled.length,
          totalDays: uniqueDays.length,
          coursesPerDay,
        },
        dateSheetBySemester: sortedBySemester,
        unscheduled,
      }),
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Datesheet error:", error);
    return NextResponse.json(
      createResponse(false, error.message || "Internal server error", null),
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/dashboard/dateSheet:
 *   get:
 *     summary: Get all dateSheets for an exam plan
 *     tags: [DateSheet]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: examPlanId
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam plan ID to fetch dateSheets for
 *     responses:
 *       200:
 *         description: DateSheets fetched successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Exam plan not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        createResponse(false, "Unauthorized", null),
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const examPlanId = searchParams.get("examPlanId");

    if (!examPlanId) {
      return NextResponse.json(
        createResponse(false, "examPlanId query parameter is required", null),
        { status: 400 },
      );
    }

    const examPlan = await prisma.examPlan.findUnique({
      where: { id: examPlanId },
    });

    if (!examPlan) {
      return NextResponse.json(
        createResponse(false, "Exam plan not found", null),
        { status: 404 },
      );
    }

    if (examPlan.userId !== session.user.id) {
      return NextResponse.json(
        createResponse(false, "Forbidden: you do not own this exam plan", null),
        { status: 403 },
      );
    }

    const dateSheets = await prisma.dateSheet.findMany({
      where: { examPlanId },
      include: { course: true },
      orderBy: [{ date: "asc" }, { slotNumber: "asc" }],
    });

    const dateSheetBySemester: Record<string, any[]> = {};

    dateSheets.forEach((ds) => {
      if (!ds.course) return;
      const semKey = `semester${ds.semester}`;
      if (!dateSheetBySemester[semKey]) {
        dateSheetBySemester[semKey] = [];
      }

      dateSheetBySemester[semKey].push({
        id: ds.id,
        courseId: ds.courseId,
        courseCode: ds.course.courseCode,
        courseName: ds.course.courseName,
        totalStudents: ds.course.totalStudents,
        examDate: ds.date.toISOString().split("T")[0],
        slotNumber: ds.slotNumber,
        startTime: ds.startTime,
        endTime: ds.endTime,
        rooms: ds.rooms,
        status: ds.course.freshSemesters.includes(ds.semester)
          ? "Fresh"
          : "Repeater",
      });
    });

    const sortedBySemester = Object.keys(dateSheetBySemester)
      .sort(
        (a, b) =>
          parseInt(a.replace("semester", "")) -
          parseInt(b.replace("semester", "")),
      )
      .reduce(
        (acc, key) => {
          acc[key] = dateSheetBySemester[key];
          return acc;
        },
        {} as Record<string, any[]>,
      );

    return NextResponse.json(
      createResponse(true, "DateSheets fetched successfully", {
        examPlan: {
          id: examPlan.id,
          title: examPlan.title,
          startDate: examPlan.startDate.toISOString(),
          endDate: examPlan.endDate.toISOString(),
          slotsPerDay: examPlan.slotsPerDay,
          slotDuration: examPlan.slotDuration,
          breakDuration: examPlan.breakDuration,
          dayStartTime: examPlan.dayStartTime,
          dayEndTime: examPlan.dayEndTime,
          totalRooms: examPlan.totalRooms,
          studentsPerRoom: examPlan.studentsPerRoom,
          createdAt: examPlan.createdAt.toISOString(),
        },
        dateSheetBySemester: sortedBySemester,
        totalCourses: dateSheets.length,
      }),
      { status: 200 },
    );
  } catch (error: any) {
    console.error("DateSheet fetch error:", error);
    return NextResponse.json(
      createResponse(false, error.message || "Internal server error", null),
      { status: 500 },
    );
  }
}