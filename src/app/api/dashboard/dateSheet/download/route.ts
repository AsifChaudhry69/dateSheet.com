import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import prisma from "../../../../../lib/db";
import { createResponse } from "../../../../../utils/createResponse";
import { authOptions } from "../../../../../lib/auth";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDayName(dateStr: string): string {
  return DAY_NAMES[new Date(dateStr).getDay()];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

interface RoomDetail {
  room: number;
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
    const bySemester: Record<number, any[]> = {};
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
        time: `${ds.startTime} - ${ds.endTime}`,
        rooms: (ds.rooms as unknown as RoomDetail[]).map((r) => r.room).join(", "),
        status: ds.course.freshSemesters.includes(ds.semester) ? "Fresh" : "Repeater",
      });
    }

    const sortedSemesters = Object.keys(bySemester).map(Number).sort((a, b) => a - b);

    // ── Generate PDF ──
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 12;

    // Title
    doc.setFontSize(16).setTextColor(41, 128, 185);
    doc.text("Date Sheet", pageWidth / 2, 18, { align: "center" });

    doc.setFontSize(12).setTextColor(44, 62, 80);
    doc.text(examPlan.title, pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(9).setTextColor(127, 140, 141);
    doc.text(
      `Exam Period: ${formatDate(examPlan.startDate.toISOString())} - ${formatDate(examPlan.endDate.toISOString())}`,
      pageWidth / 2, 31, { align: "center" },
    );

    const columns = ["#", "Course Name", "Course Code", "Date", "Day", "Time", "Room(s)", "Status"];

    let currentY = 38;

    for (const semester of sortedSemesters) {
      const rows = bySemester[semester];

      // Semester header
      doc.setFontSize(11).setTextColor(41, 128, 185);
      doc.text(`Semester ${semester}  (${rows.length} exams)`, margin, currentY + 4);
      currentY += 8;

      autoTable(doc, {
        head: [columns],
        body: rows.map((row, i) => [
          String(i + 1),
          row.courseName,
          row.courseCode,
          formatDate(row.examDate),
          row.day,
          row.time,
          row.rooms,
          row.status,
        ]),
        startY: currentY,
        margin: { left: margin, right: margin },
        tableWidth: pageWidth - 2 * margin,
        styles: {
          fontSize: 7,
          cellPadding: 1.5,
          textColor: [44, 62, 80],
          lineColor: [189, 195, 199],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 8, halign: "center" },
          1: { cellWidth: 58 },
          2: { cellWidth: 28 },
          3: { cellWidth: 36 },
          4: { cellWidth: 28 },
          5: { cellWidth: 36 },
          6: { cellWidth: 28 },
          7: { cellWidth: 18, halign: "center" },
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 7) {
            const status = data.cell.raw as string;
            if (status === "Fresh") {
              data.cell.styles.textColor = [39, 174, 96];
            } else {
              data.cell.styles.textColor = [230, 126, 34];
            }
          }
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 10;
    if (currentY > footerY) {
      doc.addPage();
    }
    doc.setFontSize(7).setTextColor(127, 140, 141);
    doc.text(
      `Generated on ${new Date().toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })}`,
      pageWidth / 2, doc.internal.pageSize.getHeight() - 8,
      { align: "center" },
    );

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    const sanitizedTitle = examPlan.title.replace(/[^a-zA-Z0-9 _-]/g, "");

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
