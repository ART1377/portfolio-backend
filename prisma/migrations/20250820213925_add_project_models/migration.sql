-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lang" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProjectItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "ProjectItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectTechnology" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "projectItemId" INTEGER NOT NULL,
    CONSTRAINT "ProjectTechnology_projectItemId_fkey" FOREIGN KEY ("projectItemId") REFERENCES "ProjectItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_lang_key" ON "Project"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectItem_projectId_title_key" ON "ProjectItem"("projectId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTechnology_projectItemId_name_key" ON "ProjectTechnology"("projectItemId", "name");
