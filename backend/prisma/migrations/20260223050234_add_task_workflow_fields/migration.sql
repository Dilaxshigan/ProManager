-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "approvalStatus" TEXT,
ADD COLUMN     "clientApproval" BOOLEAN DEFAULT false,
ADD COLUMN     "completedDate" TIMESTAMP(3),
ADD COLUMN     "estimatedHours" INTEGER,
ADD COLUMN     "finalComments" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviewComments" TEXT,
ADD COLUMN     "reviewerName" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "submittedById" TEXT,
ADD COLUMN     "totalTimeSpent" DOUBLE PRECISION;
