/*
  Warnings:

  - You are about to alter the column `filePath` on the `AudioFile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `format` on the `AudioFile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(32)`.
  - You are about to alter the column `email` on the `UserAuth` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(64)`.
  - You are about to alter the column `password` on the `UserAuth` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(64)`.
  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioFile" ALTER COLUMN "filePath" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "format" SET DATA TYPE VARCHAR(32);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT NOT NULL,
ALTER COLUMN "username" SET DATA TYPE VARCHAR(32);

-- AlterTable
ALTER TABLE "UserAuth" ALTER COLUMN "email" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(64);
