/*
  Warnings:

  - The `category` column on the `AudioFile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AudioFile" DROP COLUMN "category",
ADD COLUMN     "category" TEXT[];

-- DropEnum
DROP TYPE "AudioCategory";
