/*
  Warnings:

  - You are about to drop the column `area` on the `Vaga` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vaga" DROP COLUMN "area",
ADD COLUMN     "areaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Vaga" ADD CONSTRAINT "Vaga_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "AreaFormacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
