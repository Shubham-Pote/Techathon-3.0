-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_mobile_key" ON "Farmer"("mobile");

-- CreateIndex
CREATE INDEX "Otp_mobile_idx" ON "Otp"("mobile");
