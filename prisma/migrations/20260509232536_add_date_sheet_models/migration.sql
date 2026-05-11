-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "totalStudents" INTEGER NOT NULL,
    "freshSemesters" INTEGER[],
    "repeatSemesters" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "slotsPerDay" INTEGER NOT NULL,
    "slotDuration" INTEGER NOT NULL,
    "breakDuration" INTEGER NOT NULL,
    "dayStartTime" TEXT NOT NULL,
    "dayEndTime" TEXT NOT NULL,
    "totalRooms" INTEGER NOT NULL,
    "studentsPerRoom" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DateSheet" (
    "id" TEXT NOT NULL,
    "examPlanId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "slotNumber" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "rooms" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DateSheet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseCode_key" ON "Course"("courseCode");

-- CreateIndex
CREATE INDEX "DateSheet_examPlanId_idx" ON "DateSheet"("examPlanId");

-- CreateIndex
CREATE INDEX "DateSheet_courseId_idx" ON "DateSheet"("courseId");

-- AddForeignKey
ALTER TABLE "DateSheet" ADD CONSTRAINT "DateSheet_examPlanId_fkey" FOREIGN KEY ("examPlanId") REFERENCES "ExamPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DateSheet" ADD CONSTRAINT "DateSheet_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
