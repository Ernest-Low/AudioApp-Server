/*
  Warnings:

  - You are about to drop the column `songName` on the `AudioFile` table. All the data in the column will be lost.
  - Added the required column `audioName` to the `AudioFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioFile" DROP COLUMN "songName",
ADD COLUMN     "audioName" VARCHAR(128) NOT NULL;
