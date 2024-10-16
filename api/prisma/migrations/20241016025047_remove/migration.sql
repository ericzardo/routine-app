/*
  Warnings:

  - You are about to drop the `habits` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `habits` DROP FOREIGN KEY `habits_profileId_fkey`;

-- DropTable
DROP TABLE `habits`;
