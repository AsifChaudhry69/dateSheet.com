import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import PDFDocument from "pdfkit";
import prisma from "../../../../../lib/db";
import { createResponse } from "../../../../../utils/createResponse";
import { authOptions } from "../../../../../lib/auth";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const COLORS = {
  primary: [41, 128, 185] as [number, number, number],
  headerBg: [52, 73, 94] as [number, number, number],
  headerText: [255, 255, 255] as [number, number, number],
  border: [189, 195, 199] as [number, number, number],
  altRow: [245, 247, 250] as [number, number, number],
  text: [44, 62, 80] as [number, number, number],
  muted: [127, 140, 141] as [number, number, number],
  fresh: [39, 174, 96] as [number, number, number],
  repeater: [230, 126, 34] as [number, number, number],
};

function getDayName(dateStr: string): string {
  const d = new Date(dateStr);
  return DAY_NAMES[d.getDay()];
}

function rgb(...color: [number, number, number]): string {
  return `rgb(${color[0]},${color[1]},${color[2]})`;
}

interface RoomDetail {
  room: number;
}

interface DateSheetRow {
  semester: number;
  courseName: string;
  courseCode: string;
  examDate: string;
  day: string;
  startTime: string;
  endTime: string;
  rooms: RoomDetail[];
  status: "Fresh" | "Repeater";
}

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
        createResponse(false, "Forbidden", null),
        { status: 403 },
      );
    }

    const dateSheets = await prisma.dateSheet.findMany({
      where: { examPlanId },
      include: { course: true },
      orderBy: [{ semester: "asc" }, { date: "asc" }, { slotNumber: "asc" }],
    });

    // Group by semester
    const bySemester: Record<number, DateSheetRow[]> = {};
    for (const ds of dateSheets) {
      if (!ds.course) continue;
      if (!bySemester[ds.semester]) {
        bySemester[ds.semester] = [];
      }
      bySemester[ds.semester].push({
        semester: ds.semester,
        courseName: ds.course.courseName,
        courseCode: ds.course.courseCode,
        examDate: ds.date.toISOString().split("T")[0],
        day: getDayName(ds.date.toISOString().split("T")[0]),
        startTime: ds.startTime,
        endTime: ds.endTime,
        rooms: ds.rooms as unknown as RoomDetail[],
        status: ds.course.freshSemesters.includes(ds.semester) ? "Fresh" : "Repeater",
      });
    }

    // Generate PDF
    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" });
    const buffers: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => buffers.push(chunk));

    const sanitizedTitle = examPlan.title.replace(/[^a-zA-Z0-9 _-]/g, "");

    await new Promise<void>((resolve, reject) => {
      doc.on("end", () => resolve());
      doc.on("error", reject);

      // ── Header ──
      doc.fontSize(20).fillColor(rgb(...COLORS.primary))
        .text("Date Sheet", { align: "center" });
      doc.fontSize(14).fillColor(rgb(...COLORS.text))
        .text(examPlan.title, { align: "center" });
      doc.fontSize(10).fillColor(rgb(...COLORS.muted))
        .text(
          `Exam Period: ${examPlan.startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} - ${examPlan.endDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`,
          { align: "center" },
        );
      doc.moveDown(1);

      // Table settings
      const pageWidth = doc.page.width - 60;
      const colWidths = [30, 120, 80, 100, 100, 90, 80, 60];
      const startX = 30;
      const headerY = doc.y;
      const rowHeight = 20;

      const sortedSemesters = Object.keys(bySemester).map(Number).sort((a, b) => a - b);

      for (const semester of sortedSemesters) {
        const rows = bySemester[semester];

        // Check if we need a new page
        const neededSpace = 40 + (rows.length + 1) * rowHeight + 20;
        if (doc.y + neededSpace > doc.page.height - 30) {
          doc.addPage();
        }

        // Semester header
        doc.fontSize(13).fillColor(rgb(...COLORS.primary))
          .text(`Semester ${semester}  (${rows.length} exams)`, { underline: false });
        doc.moveDown(0.5);

        let y = doc.y;
        const tableTop = y;

        // Column headers
        const headers = ["#", "Course Name", "Course Code", "Date", "Day", "Time", "Room(s)", "Status"];
        doc.fontSize(8).fillColor(rgb(...COLORS.headerText));

        let x = startX;
        for (let i = 0; i < headers.length; i++) {
          doc.rect(x, y, colWidths[i], rowHeight).fill(rgb(...COLORS.headerBg));
          doc.fillColor(rgb(...COLORS.headerText))
            .text(headers[i], x + 2, y + 5, {
              width: colWidths[i] - 4,
              align: i === 0 ? "center" : "left",
              lineBreak: false,
            });
          x += colWidths[i];
        }

        y += rowHeight;

        // Data rows
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          // Row background
          if (i % 2 === 1) {
            doc.rect(startX, y, pageWidth, rowHeight).fill(rgb(...COLORS.altRow));
          }

          // Row border
          doc.strokeColor(rgb(...COLORS.border)).lineWidth(0.5)
            .rect(startX, y, pageWidth, rowHeight).stroke();

          x = startX;
          const cells = [
            String(i + 1),
            row.courseName,
            row.courseCode,
            new Date(row.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            row.day,
            `${row.startTime} - ${row.endTime}`,
            row.rooms.map((r) => r.room).join(", "),
            row.status,
          ];

          doc.fontSize(8).fillColor(rgb(...COLORS.text));
          for (let j = 0; j < cells.length; j++) {
            const align = j === 0 ? "center" : "left";
            const color = j === 7
              ? (row.status === "Fresh" ? rgb(...COLORS.fresh) : rgb(...COLORS.repeater))
              : rgb(...COLORS.text);
            doc.fillColor(color).text(cells[j], x + 2, y + 5, {
              width: colWidths[j] - 4,
              align,
              lineBreak: false,
            });
            x += colWidths[j];
          }

          y += rowHeight;
        }

        // Bottom border of table
        doc.strokeColor(rgb(...COLORS.border)).lineWidth(0.5)
          .rect(startX, tableTop, pageWidth, y - tableTop).stroke();

        doc.y = y + 15;
      }

      // Footer
      if (doc.y > doc.page.height - 60) {
        doc.addPage();
      }
      doc.fontSize(8).fillColor(rgb(...COLORS.muted))
        .text(`Generated on ${new Date().toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`, { align: "center" });

      doc.end();
    });

    const pdfBuffer = Buffer.concat(buffers);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="datesheet-${sanitizedTitle}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: any) {
    console.error("DateSheet download error:", error);
    return NextResponse.json(
      createResponse(false, error.message || "Internal server error", null),
      { status: 500 },
    );
  }
}
