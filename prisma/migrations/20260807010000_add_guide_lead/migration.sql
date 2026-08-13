-- CreateTable
CREATE TABLE "GuideLead" (
    "id" TEXT NOT NULL,
    "guideSlug" TEXT NOT NULL,
    "guideTitle" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "companyName" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuideLead_guideSlug_idx" ON "GuideLead"("guideSlug");

-- CreateIndex
CREATE INDEX "GuideLead_email_idx" ON "GuideLead"("email");

-- CreateIndex
CREATE INDEX "GuideLead_createdAt_idx" ON "GuideLead"("createdAt");
