/*
  Warnings:

  - You are about to drop the column `filename` on the `AudioFile` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `AudioFile` table. All the data in the column will be lost.
  - Added the required column `songName` to the `AudioFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AudioFile_filename_key";

-- AlterTable
ALTER TABLE "AudioFile" DROP COLUMN "filename",
DROP COLUMN "format",
ADD COLUMN     "songName" VARCHAR(128) NOT NULL;
