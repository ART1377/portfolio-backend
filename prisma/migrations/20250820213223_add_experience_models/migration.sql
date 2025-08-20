-- CreateTable
CREATE TABLE "Experience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lang" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExperienceItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "experienceId" INTEGER NOT NULL,
    CONSTRAINT "ExperienceItem_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExperienceTechnology" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "experienceItemId" INTEGER NOT NULL,
    CONSTRAINT "ExperienceTechnology_experienceItemId_fkey" FOREIGN KEY ("experienceItemId") REFERENCES "ExperienceItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EducationItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "degree" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "experienceId" INTEGER NOT NULL,
    CONSTRAINT "EducationItem_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CourseItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "experienceId" INTEGER NOT NULL,
    CONSTRAINT "CourseItem_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Experience_lang_key" ON "Experience"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceTechnology_experienceItemId_name_key" ON "ExperienceTechnology"("experienceItemId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CourseItem_experienceId_name_org_key" ON "CourseItem"("experienceId", "name", "org");
