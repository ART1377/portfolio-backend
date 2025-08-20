-- CreateTable
CREATE TABLE "About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lang" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AboutDescription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "aboutId" INTEGER NOT NULL,
    CONSTRAINT "AboutDescription_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "About" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AboutSkill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "aboutId" INTEGER NOT NULL,
    CONSTRAINT "AboutSkill_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "About" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AboutFeature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "aboutId" INTEGER NOT NULL,
    CONSTRAINT "AboutFeature_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "About" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "About_lang_key" ON "About"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "AboutDescription_aboutId_content_key" ON "AboutDescription"("aboutId", "content");

-- CreateIndex
CREATE UNIQUE INDEX "AboutSkill_aboutId_name_key" ON "AboutSkill"("aboutId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "AboutFeature_aboutId_title_key" ON "AboutFeature"("aboutId", "title");
