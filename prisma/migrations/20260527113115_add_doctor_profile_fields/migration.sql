-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "affiliations" TEXT,
ADD COLUMN     "consultingTimes" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "practiceModel" TEXT,
ADD COLUMN     "preferredLocations" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "subSpecialty" TEXT,
ADD COLUMN     "website" TEXT;
