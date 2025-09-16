/*
  Warnings:

  - Added the required column `updatedAt` to the `UploadDocument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanEvent" AS ENUM ('created', 'renewed', 'expired', 'canceled');

-- AlterEnum
ALTER TYPE "PlanName" ADD VALUE 'TRIAL';

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isFreeTrial" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "stripeSubscriptionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UploadDocument" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "hasUsedFreeTrial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profileImage" TEXT;

-- CreateTable
CREATE TABLE "trainbot" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "botName" TEXT NOT NULL,
    "botDescription" TEXT,
    "botdbconfigurationId" UUID,
    "websiteId" UUID,
    "prebuildQuestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isDateShown" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainbot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userWebsite" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userWebsite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionLog" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "planName" "PlanName" NOT NULL,
    "priceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "event" "PlanEvent" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "SubscriptionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "botdbconfiguration" (
    "id" TEXT NOT NULL,
    "databaseType" TEXT NOT NULL,
    "databaseName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "botdbconfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainbot_botName_key" ON "trainbot"("botName");

-- CreateIndex
CREATE UNIQUE INDEX "userWebsite_websiteUrl_key" ON "userWebsite"("websiteUrl");

-- AddForeignKey
ALTER TABLE "trainbot" ADD CONSTRAINT "trainbot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainbot" ADD CONSTRAINT "trainbot_botdbconfigurationId_fkey" FOREIGN KEY ("botdbconfigurationId") REFERENCES "botdbconfiguration"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainbot" ADD CONSTRAINT "trainbot_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "userWebsite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userWebsite" ADD CONSTRAINT "userWebsite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "botdbconfiguration" ADD CONSTRAINT "botdbconfiguration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
