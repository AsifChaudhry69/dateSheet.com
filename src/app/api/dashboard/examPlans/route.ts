import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { createResponse } from "../../../../utils/createResponse";

export async function GET(req: NextRequest) {
  try {
    const examPlans = await prisma.examPlan.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            dateSheets: true,
          },
        },
      },
    });

    return NextResponse.json(
      createResponse(true, "Exam plans fetched successfully", {
        examPlans: examPlans.map((plan) => ({
          id: plan.id,
          title: plan.title,
          startDate: plan.startDate.toISOString(),
          endDate: plan.endDate.toISOString(),
          slotsPerDay: plan.slotsPerDay,
          totalRooms: plan.totalRooms,
          studentsPerRoom: plan.studentsPerRoom,
          createdAt: plan.createdAt.toISOString(),
          totalDateSheets: plan._count.dateSheets,
        })),
      }),
      { status: 200 },
    );
  } catch (error: any) {
    console.error("ExamPlans fetch error:", error);
    return NextResponse.json(
      createResponse(false, error.message || "Internal server error", null),
      { status: 500 },
    );
  }
}
