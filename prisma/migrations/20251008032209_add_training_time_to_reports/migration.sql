-- CreateTable
CREATE TABLE "TrainingReport" (
    "id" TEXT NOT NULL,
    "traineeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trainingTime" TEXT,
    "sleepHours" TEXT,
    "readiness" TEXT,
    "fieldType" TEXT,
    "effortLevel" TEXT,
    "bodyFeeling" TEXT,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "weatherDesc" TEXT,
    "wind" DOUBLE PRECISION,
    "overallRating" TEXT,
    "advice" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TrainingReport" ADD CONSTRAINT "TrainingReport_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
