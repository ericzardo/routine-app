/*
  Warnings:

  - You are about to alter the column `type` on the `Document` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Made the column `repeat` on table `alarms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Document` MODIFY `type` ENUM('FILE', 'FOLDER') NOT NULL;

-- AlterTable
ALTER TABLE `alarms` MODIFY `repeat` JSON NOT NULL;
