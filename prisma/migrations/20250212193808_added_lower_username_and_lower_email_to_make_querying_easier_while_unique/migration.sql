/*
  Warnings:

  - A unique constraint covering the columns `[lowerUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lowerEmail]` on the table `UserAuth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lowerUsername` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lowerEmail` to the `UserAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lowerUsername" VARCHAR(128) NOT NULL;

-- AlterTable
ALTER TABLE "UserAuth" ADD COLUMN     "lowerEmail" VARCHAR(128) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_lowerUsername_key" ON "User"("lowerUsername");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_lowerEmail_key" ON "UserAuth"("lowerEmail");
