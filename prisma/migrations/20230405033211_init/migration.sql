-- CreateTable
CREATE TABLE `PilihanGanda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` DATETIME(0) NOT NULL,
    `pilihan_A` VARCHAR(15) NOT NULL,
    `pilihan_B` VARCHAR(15) NOT NULL,
    `pilihan_C` VARCHAR(15) NOT NULL,
    `pilihan_D` VARCHAR(15) NOT NULL,
    `SoalId` INTEGER NOT NULL,

    UNIQUE INDEX `PilihanGanda_SoalId_key`(`SoalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jawaban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` DATETIME(0) NOT NULL,
    `jawaban` VARCHAR(15) NOT NULL,
    `PilihanGandaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PilihanGanda` ADD CONSTRAINT `PilihanGanda_SoalId_fkey` FOREIGN KEY (`SoalId`) REFERENCES `Soal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jawaban` ADD CONSTRAINT `Jawaban_PilihanGandaId_fkey` FOREIGN KEY (`PilihanGandaId`) REFERENCES `PilihanGanda`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
