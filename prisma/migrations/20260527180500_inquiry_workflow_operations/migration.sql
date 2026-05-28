-- Create new inquiry status enum
CREATE TYPE "InquiryStatus_new" AS ENUM ('NEW', 'CONTACTED', 'IN_DISCUSSION', 'MATCHED', 'CLOSED', 'REJECTED');

ALTER TABLE "Inquiry"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Inquiry"
  ALTER COLUMN "status" TYPE "InquiryStatus_new"
  USING (
    CASE "status"::text
      WHEN 'pending' THEN 'NEW'
      WHEN 'contacted' THEN 'CONTACTED'
      WHEN 'resolved' THEN 'MATCHED'
      ELSE 'NEW'
    END
  )::"InquiryStatus_new";

DROP TYPE "InquiryStatus";

ALTER TYPE "InquiryStatus_new" RENAME TO "InquiryStatus";

ALTER TABLE "Listing"
  ADD COLUMN "ownerUserId" TEXT;

ALTER TABLE "Inquiry"
  ADD COLUMN "adminNotes" TEXT,
  ADD COLUMN "closedAt" TIMESTAMP(3),
  ADD COLUMN "contactedAt" TIMESTAMP(3),
  ADD COLUMN "createdByUserId" TEXT,
  ADD COLUMN "discussionStartedAt" TIMESTAMP(3),
  ADD COLUMN "matchedAt" TIMESTAMP(3),
  ADD COLUMN "rejectedAt" TIMESTAMP(3),
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Inquiry"
SET
  "contactedAt" = CASE WHEN "status" = 'CONTACTED' THEN "createdAt" ELSE NULL END,
  "matchedAt" = CASE WHEN "status" = 'MATCHED' THEN "createdAt" ELSE NULL END,
  "updatedAt" = "createdAt";

CREATE TYPE "InquiryActivityType" AS ENUM ('INQUIRY_CREATED', 'STATUS_CHANGED', 'ADMIN_NOTE_ADDED', 'ADMIN_UPDATED', 'WORKFLOW_EVENT');

CREATE TABLE "InquiryActivity" (
  "id" TEXT NOT NULL,
  "inquiryId" TEXT NOT NULL,
  "actorUserId" TEXT,
  "type" "InquiryActivityType" NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "fromStatus" "InquiryStatus",
  "toStatus" "InquiryStatus",
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "InquiryActivity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Listing_ownerUserId_idx" ON "Listing"("ownerUserId");
CREATE INDEX "Inquiry_createdByUserId_idx" ON "Inquiry"("createdByUserId");
CREATE INDEX "InquiryActivity_inquiryId_createdAt_idx" ON "InquiryActivity"("inquiryId", "createdAt");
CREATE INDEX "InquiryActivity_type_createdAt_idx" ON "InquiryActivity"("type", "createdAt");

ALTER TABLE "Listing"
  ADD CONSTRAINT "Listing_ownerUserId_fkey"
  FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Inquiry"
  ADD CONSTRAINT "Inquiry_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InquiryActivity"
  ADD CONSTRAINT "InquiryActivity_inquiryId_fkey"
  FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InquiryActivity"
  ADD CONSTRAINT "InquiryActivity_actorUserId_fkey"
  FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
