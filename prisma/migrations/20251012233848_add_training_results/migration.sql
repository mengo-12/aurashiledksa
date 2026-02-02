/*
  Warnings:

  - You are about to drop the `TrainingReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TrainingReport" DROP CONSTRAINT "TrainingReport_traineeId_fkey";

-- DropTable
DROP TABLE "public"."TrainingReport";

-- CreateTable
CREATE TABLE "TrainingResult" (
    "id" TEXT NOT NULL,
    "trainingTime" TEXT NOT NULL,
    "sleepHours" TEXT NOT NULL,
    "readiness" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "fieldOther" TEXT,
    "effortLevel" TEXT NOT NULL,
    "bodyFeeling" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "city" TEXT,
    "condition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingResult_pkey" PRIMARY KEY ("id")
);
