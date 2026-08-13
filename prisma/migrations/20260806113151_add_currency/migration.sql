-- AlterTable
ALTER TABLE "Company" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'INR';

-- AlterTable
ALTER TABLE "MicroToolSubmission" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'INR';
