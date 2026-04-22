-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('DOC', 'SKILL', 'AGENT', 'PATTERN', 'DECISION');

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "source_url" TEXT,
    "type" "ReferenceType" NOT NULL DEFAULT 'DOC',
    "use_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snippet" (
    "id" TEXT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "copy_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Snippet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceTag" (
    "reference_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "ReferenceTag_pkey" PRIMARY KEY ("reference_id","tag_id")
);

-- CreateIndex
CREATE INDEX "Reference_user_id_idx" ON "Reference"("user_id");

-- CreateIndex
CREATE INDEX "Reference_type_idx" ON "Reference"("type");

-- CreateIndex
CREATE INDEX "Reference_created_at_idx" ON "Reference"("created_at" DESC);

-- CreateIndex
CREATE INDEX "Snippet_reference_id_idx" ON "Snippet"("reference_id");

-- AddForeignKey
ALTER TABLE "Reference" ADD CONSTRAINT "Reference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "Reference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferenceTag" ADD CONSTRAINT "ReferenceTag_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "Reference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferenceTag" ADD CONSTRAINT "ReferenceTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
