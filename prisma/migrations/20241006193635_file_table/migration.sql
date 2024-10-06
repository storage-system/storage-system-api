-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),
    "company_id" TEXT,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
