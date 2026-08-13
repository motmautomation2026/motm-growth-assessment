-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SALES', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'SCORED', 'REPORT_GENERATED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ChannelLevel" AS ENUM ('NONE', 'PARTIAL', 'FULL');

-- CreateEnum
CREATE TYPE "MicroToolCategory" AS ENUM ('WORKSHEET', 'DIAGNOSTIC', 'CALCULATOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "jobTitle" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "products" TEXT,
    "services" TEXT,
    "countries" TEXT[],
    "employees" TEXT,
    "revenueRange" TEXT,
    "targetMarket" TEXT,
    "avgDealSize" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'B2B_GROWTH',
    "status" "AssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "companyId" TEXT NOT NULL,
    "userId" TEXT,
    "leadScore" INTEGER,
    "priority" "Priority",
    "assignedSalespersonId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ICPResponse" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "generated" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ICPResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionMakerResponse" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "generated" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DecisionMakerResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesFunnelResponse" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "monthlyLeads" INTEGER NOT NULL,
    "qualifiedLeads" INTEGER NOT NULL,
    "meetings" INTEGER NOT NULL,
    "rfqs" INTEGER NOT NULL,
    "proposals" INTEGER NOT NULL,
    "orders" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "salesCycleDays" INTEGER NOT NULL,
    "leadSources" JSONB NOT NULL,
    "followUpProcess" TEXT,
    "monthlySpend" DOUBLE PRECISION,
    "generated" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesFunnelResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingResponse" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "seo" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "linkedin" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "coldEmail" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "emailMarketing" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "tradeShows" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "crm" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "automation" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "website" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "analytics" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "content" "ChannelLevel" NOT NULL DEFAULT 'NONE',
    "generated" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketingResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessGoalsResponse" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "goals" TEXT[],
    "generated" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessGoalsResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreResult" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "icpScore" INTEGER NOT NULL,
    "salesScore" INTEGER NOT NULL,
    "marketingScore" INTEGER NOT NULL,
    "automationScore" INTEGER NOT NULL,
    "crmScore" INTEGER NOT NULL,
    "leadGenScore" INTEGER NOT NULL,
    "digitalPresenceScore" INTEGER NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculatorResult" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "leadConversionRate" DOUBLE PRECISION NOT NULL,
    "meetingRate" DOUBLE PRECISION NOT NULL,
    "rfqRate" DOUBLE PRECISION NOT NULL,
    "closeRate" DOUBLE PRECISION NOT NULL,
    "leadLeakage" JSONB NOT NULL,
    "weakestStage" TEXT NOT NULL,
    "revenueLeakage" DOUBLE PRECISION NOT NULL,
    "cac" DOUBLE PRECISION,
    "pipelineHealth" DOUBLE PRECISION NOT NULL,
    "salesVelocity" DOUBLE PRECISION NOT NULL,
    "roi" DOUBLE PRECISION,
    "estimatedLostRevenue" DOUBLE PRECISION NOT NULL,
    "estimatedGrowthOpportunity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalculatorResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIReport" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "rawResponse" JSONB NOT NULL,
    "sections" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicroToolSubmission" (
    "id" TEXT NOT NULL,
    "toolSlug" TEXT NOT NULL,
    "category" "MicroToolCategory" NOT NULL,
    "email" TEXT,
    "contactName" TEXT,
    "companyName" TEXT,
    "inputs" JSONB NOT NULL,
    "outputs" JSONB,
    "aiSummary" JSONB,
    "pdfModel" TEXT,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "MicroToolSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Assessment_companyId_idx" ON "Assessment"("companyId");

-- CreateIndex
CREATE INDEX "Assessment_status_idx" ON "Assessment"("status");

-- CreateIndex
CREATE INDEX "Assessment_createdAt_idx" ON "Assessment"("createdAt");

-- CreateIndex
CREATE INDEX "Assessment_assignedSalespersonId_idx" ON "Assessment"("assignedSalespersonId");

-- CreateIndex
CREATE UNIQUE INDEX "ICPResponse_assessmentId_key" ON "ICPResponse"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "DecisionMakerResponse_assessmentId_key" ON "DecisionMakerResponse"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "SalesFunnelResponse_assessmentId_key" ON "SalesFunnelResponse"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingResponse_assessmentId_key" ON "MarketingResponse"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessGoalsResponse_assessmentId_key" ON "BusinessGoalsResponse"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ScoreResult_assessmentId_key" ON "ScoreResult"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "CalculatorResult_assessmentId_key" ON "CalculatorResult"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AIReport_assessmentId_key" ON "AIReport"("assessmentId");

-- CreateIndex
CREATE INDEX "AuditLog_assessmentId_createdAt_idx" ON "AuditLog"("assessmentId", "createdAt");

-- CreateIndex
CREATE INDEX "EmailLog_assessmentId_idx" ON "EmailLog"("assessmentId");

-- CreateIndex
CREATE INDEX "MicroToolSubmission_toolSlug_idx" ON "MicroToolSubmission"("toolSlug");

-- CreateIndex
CREATE INDEX "MicroToolSubmission_email_idx" ON "MicroToolSubmission"("email");

-- CreateIndex
CREATE INDEX "MicroToolSubmission_createdAt_idx" ON "MicroToolSubmission"("createdAt");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_assignedSalespersonId_fkey" FOREIGN KEY ("assignedSalespersonId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ICPResponse" ADD CONSTRAINT "ICPResponse_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisionMakerResponse" ADD CONSTRAINT "DecisionMakerResponse_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesFunnelResponse" ADD CONSTRAINT "SalesFunnelResponse_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingResponse" ADD CONSTRAINT "MarketingResponse_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessGoalsResponse" ADD CONSTRAINT "BusinessGoalsResponse_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreResult" ADD CONSTRAINT "ScoreResult_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalculatorResult" ADD CONSTRAINT "CalculatorResult_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIReport" ADD CONSTRAINT "AIReport_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

