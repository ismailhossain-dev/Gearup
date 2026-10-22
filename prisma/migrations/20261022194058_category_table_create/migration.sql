-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_providerId_key" ON "category"("providerId");

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "gears"("id") ON DELETE CASCADE ON UPDATE CASCADE;
