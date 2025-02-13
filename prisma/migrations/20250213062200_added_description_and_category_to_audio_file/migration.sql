/*
  Warnings:

  - Added the required column `category` to the `AudioFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `AudioFile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AudioCategory" AS ENUM ('Pop', 'Rock', 'HipHop', 'Electronic', 'RnB', 'Jazz', 'Classical', 'Latin', 'Folk', 'World', 'Other');

-- AlterTable
ALTER TABLE "AudioFile" ADD COLUMN     "category" "AudioCategory" NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;
