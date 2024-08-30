-- CreateTable
CREATE TABLE "configurations" (
    "id" TEXT NOT NULL,
    "days_before_old_stock" INTEGER NOT NULL,
    "warning_days" INTEGER NOT NULL,
    "email_notification" BOOLEAN NOT NULL,
    "system_notification" BOOLEAN NOT NULL,
    "auto_discard_after_expiration" BOOLEAN NOT NULL,
    "free_shipping_on_old_stock" BOOLEAN NOT NULL,
    "report_frequency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "configurations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configurations" ADD CONSTRAINT "configurations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
