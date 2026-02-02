/*
  Warnings:

  - A unique constraint covering the columns `[traineeId]` on the table `TrainingResult` will be added. If there are existing duplicate values, this will fail.
  - Made the column `temperature` on table `TrainingResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `humidity` on table `TrainingResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `TrainingResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `condition` on table `TrainingResult` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TrainingResult" ALTER COLUMN "temperature" SET NOT NULL,
ALTER COLUMN "temperature" SET DEFAULT 0,
ALTER COLUMN "humidity" SET NOT NULL,
ALTER COLUMN "humidity" SET DEFAULT 0,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "city" SET DEFAULT 'غير محدد',
ALTER COLUMN "condition" SET NOT NULL,
ALTER COLUMN "condition" SET DEFAULT 'غير معروف';

-- CreateIndex
CREATE UNIQUE INDEX "TrainingResult_traineeId_key" ON "TrainingResult"("traineeId");
