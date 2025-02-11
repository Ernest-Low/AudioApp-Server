/*
  Warnings:

  - You are about to drop the column `public` on the `AudioFile` table. All the data in the column will be lost.
  - You are about to drop the column `private` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - Added the required column `isPrivate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioFile" DROP COLUMN "public",
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "private",
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(30);
