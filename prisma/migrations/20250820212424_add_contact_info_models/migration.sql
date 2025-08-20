-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lang" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactSocial" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contactInfoId" INTEGER NOT NULL,
    CONSTRAINT "ContactSocial_contactInfoId_fkey" FOREIGN KEY ("contactInfoId") REFERENCES "ContactInfo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactInfo_lang_key" ON "ContactInfo"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "ContactSocial_contactInfoId_platform_key" ON "ContactSocial"("contactInfoId", "platform");
