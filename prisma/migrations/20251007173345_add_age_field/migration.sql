/*
  Warnings:

  - You are about to drop the column `password` on the `Trainee` table. All the data in the column will be lost.
  - Added the required column `age` to the `Trainee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Trainee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trainee" DROP COLUMN "password",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "agreed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" VARCHAR(20) NOT NULL;
