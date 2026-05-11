/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Upload courses from Excel data
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courses
 *             properties:
 *               courses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - courseCode
 *                     - courseName
 *                     - totalStudents
 *                     - freshSemesters
 *                     - repeatSemesters
 *                   properties:
 *                     courseCode:
 *                       type: string
 *                       example: "CS101"
 *                     courseName:
 *                       type: string
 *                       example: "Introduction to Programming"
 *                     totalStudents:
 *                       type: integer
 *                       example: 120
 *                     freshSemesters:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 2, 3]
 *                     repeatSemesters:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [4, 5, 6]
 *     responses:
 *       200:
 *         description: Courses saved successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Internal server error
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import prisma from "../../../../lib/db";
import { createResponse } from "../../../../utils/createResponse";
import { authOptions } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Get logged-in user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        createResponse(false, "Unauthorized", null),
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse body
    const body = await req.json();
    const { courses } = body;

    // Validate courses array
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json(
        createResponse(false, "Courses array is required", null),
        { status: 400 }
      );
    }

    // Strict validation
    const invalidCourse = courses.find(
      (course) =>
        !course.courseCode ||
        !course.courseName ||
        course.totalStudents === undefined ||

        !Array.isArray(course.freshSemesters) ||
        course.freshSemesters.some(
          (s: unknown) =>
            s === null ||
            s === undefined ||
            typeof s !== "number" ||
            Number.isNaN(s)
        ) ||

        !Array.isArray(course.repeatSemesters) ||
        course.repeatSemesters.some(
          (s: unknown) =>
            s === null ||
            s === undefined ||
            typeof s !== "number" ||
            Number.isNaN(s)
        )
    );

    if (invalidCourse) {
      return NextResponse.json(
        createResponse(
          false,
          `Invalid data for course: ${
            invalidCourse.courseCode || "unknown"
          }`,
          null
        ),
        { status: 400 }
      );
    }

    // Get existing courses
    const courseCodes = courses.map(
      (c) => c.courseCode
    );

    const existingCourses = await prisma.course.findMany({
      where: {
        userId,
        courseCode: {
          in: courseCodes,
        },
      },
      select: {
        courseCode: true,
      },
    });

    const existingCodesSet = new Set(
      existingCourses.map((c) => c.courseCode)
    );

    // Split create/update
    const toCreate = courses.filter(
      (c) => !existingCodesSet.has(c.courseCode)
    );

    const toUpdate = courses.filter(
      (c) => existingCodesSet.has(c.courseCode)
    );

    // Create new courses
    if (toCreate.length > 0) {
      await prisma.course.createMany({
        data: toCreate.map((course) => ({
          courseCode: String(course.courseCode).trim(),

          courseName: String(course.courseName).trim(),

          totalStudents: Number(course.totalStudents),

          freshSemesters: (
            course.freshSemesters || []
          ).filter(
            (s: number | null | undefined) =>
              s !== null &&
              s !== undefined &&
              !Number.isNaN(s)
          ),

          repeatSemesters: (
            course.repeatSemesters || []
          ).filter(
            (s: number | null | undefined) =>
              s !== null &&
              s !== undefined &&
              !Number.isNaN(s)
          ),

          userId,
        })),
        skipDuplicates: true,
      });
    }

    // Update existing courses
    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map((course) =>
          prisma.course.update({
            where: {
              userId_courseCode: {
                userId,
                courseCode: course.courseCode,
              },
            },

            data: {
              courseName: String(course.courseName).trim(),

              totalStudents: Number(course.totalStudents),

              freshSemesters: (
                course.freshSemesters || []
              ).filter(
                (s: number | null | undefined) =>
                  s !== null &&
                  s !== undefined &&
                  !Number.isNaN(s)
              ),

              repeatSemesters: (
                course.repeatSemesters || []
              ).filter(
                (s: number | null | undefined) =>
                  s !== null &&
                  s !== undefined &&
                  !Number.isNaN(s)
              ),
            },
          })
        )
      );
    }

    return NextResponse.json(
      createResponse(true, "Courses saved successfully", {
        created: toCreate.length,
        updated: toUpdate.length,
        total: courses.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Course upload error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error
          ? error.message
          : "Internal server error",
        null
      ),
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *       500:
 *         description: Internal server error
 */

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        courseCode: "asc",
      },
    });

    return NextResponse.json(
      createResponse(true, "Courses fetched successfully", {
        courses,
        total: courses.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Course fetch error:", error);

    return NextResponse.json(
      createResponse(
        false,
        error instanceof Error
          ? error.message
          : "Internal server error",
        null
      ),
      { status: 500 }
    );
  }
}