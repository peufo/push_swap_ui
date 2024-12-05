/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageLarge` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageMedium` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageMicro` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageSmall` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `displayname` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageLarge` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageMedium` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageMicro` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageSmall` VARCHAR(191) NOT NULL,
    ADD COLUMN `login` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
