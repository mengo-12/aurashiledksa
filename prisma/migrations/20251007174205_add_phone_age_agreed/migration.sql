/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Trainee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Trainee_phone_key" ON "Trainee"("phone");
