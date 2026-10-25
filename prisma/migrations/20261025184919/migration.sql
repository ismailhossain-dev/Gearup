-- DropIndex
DROP INDEX "reviews_customerId_key";

-- DropIndex
DROP INDEX "reviews_gearId_key";

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "comment" DROP NOT NULL;
