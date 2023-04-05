/*
  Warnings:

  - You are about to drop the column `PilihanGandaId` on the `jawaban` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[SoalId]` on the table `Jawaban` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `SoalId` to the `Jawaban` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `jawaban` DROP FOREIGN KEY `Jawaban_PilihanGandaId_fkey`;

-- AlterTable
ALTER TABLE `jawaban` DROP COLUMN `PilihanGandaId`,
    ADD COLUMN `SoalId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Jawaban_SoalId_key` ON `Jawaban`(`SoalId`);

-- AddForeignKey
ALTER TABLE `Jawaban` ADD CONSTRAINT `Jawaban_SoalId_fkey` FOREIGN KEY (`SoalId`) REFERENCES `Soal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
