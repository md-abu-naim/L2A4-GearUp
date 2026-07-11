-- DropForeignKey
ALTER TABLE "rentalOrders" DROP CONSTRAINT "rentalOrders_gearItemId_fkey";

-- AddForeignKey
ALTER TABLE "rentalOrders" ADD CONSTRAINT "rentalOrders_gearItemId_fkey" FOREIGN KEY ("gearItemId") REFERENCES "gearItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
