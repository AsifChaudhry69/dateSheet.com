import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "../../../../../lib/db";
import { createResponse } from "../../../../../utils/createResponse";
import { authOptions } from "../../../../../lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        createResponse(false, "Unauthorized", null),
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { courseName, totalStudents, freshSemesters, repeatSemesters } = body;

    if (!courseName || totalStudents === undefined) {
      return NextResponse.json(
        createResponse(false, "courseName and totalStudents are required", null),
        { status: 400 },
      );
    }

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        createResponse(false, "Course not found", null),
        { status: 404 },
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        createResponse(false, "Forbidden", null),
        { status: 403 },
      );
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        courseName: String(courseName).trim(),
        totalStudents: Number(totalStudents),
        freshSemesters: (freshSemesters || []).filter(
          (s: number | null | undefined) => s !== null && s !== undefined && !Number.isNaN(s),
        ),
        repeatSemesters: (repeatSemesters || []).filter(
          (s: number | null | undefined) => s !== null && s !== undefined && !Number.isNaN(s),
        ),
      },
    });

    return NextResponse.json(
      createResponse(true, "Course updated successfully", { course: updated }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Course update error:", error);
    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Internal server error",
        null,
      ),
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        createResponse(false, "Unauthorized", null),
        { status: 401 },
      );
    }

    const { id } = await params;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        createResponse(false, "Course not found", null),
        { status: 404 },
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        createResponse(false, "Forbidden", null),
        { status: 403 },
      );
    }

    await prisma.course.delete({ where: { id } });

    return NextResponse.json(
      createResponse(true, "Course deleted successfully", null),
      { status: 200 },
    );
  } catch (error) {
    console.error("Course delete error:", error);
    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error ? error.message : "Internal server error",
        null,
      ),
      { status: 500 },
    );
  }
}
