/*
  Warnings:

  - Added the required column `campus` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `campus` VARCHAR(191) NOT NULL;
