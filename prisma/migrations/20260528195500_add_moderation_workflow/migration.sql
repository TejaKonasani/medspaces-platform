-- CreateEnum
CREATE TYPE "ListingModerationStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DoctorModerationStatus" AS ENUM ('PENDING', 'VERIFIED', 'INACTIVE');

-- AlterTable
ALTER TABLE "Listing"
ADD COLUMN "moderationStatus" "ListingModerationStatus" NOT NULL DEFAULT 'PENDING_REVIEW';

-- AlterTable
ALTER TABLE "Doctor"
ADD COLUMN "status" "DoctorModerationStatus" NOT NULL DEFAULT 'PENDING';
