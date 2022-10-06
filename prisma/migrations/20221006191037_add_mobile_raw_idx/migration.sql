-- DropIndex
DROP INDEX "accounts_email_mobile_idx";

-- CreateIndex
CREATE INDEX "accounts_email_mobile_mobile_raw_idx" ON "accounts"("email", "mobile", "mobile_raw");
