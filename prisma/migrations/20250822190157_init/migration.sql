-- CreateTable
CREATE TABLE "public"."Hero" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "roles" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Social" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "heroId" INTEGER NOT NULL,

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Resume" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "heroId" INTEGER NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."About" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AboutDescription" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "aboutId" INTEGER NOT NULL,

    CONSTRAINT "AboutDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AboutSkill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "aboutId" INTEGER NOT NULL,

    CONSTRAINT "AboutSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AboutFeature" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "aboutId" INTEGER NOT NULL,

    CONSTRAINT "AboutFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactInfo" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactSocial" (
    "id" SERIAL NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contactInfoId" INTEGER NOT NULL,

    CONSTRAINT "ContactSocial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Experience" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExperienceItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "experienceId" INTEGER NOT NULL,

    CONSTRAINT "ExperienceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExperienceTechnology" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "experienceItemId" INTEGER NOT NULL,

    CONSTRAINT "ExperienceTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EducationItem" (
    "id" SERIAL NOT NULL,
    "degree" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "experienceId" INTEGER NOT NULL,

    CONSTRAINT "EducationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "experienceId" INTEGER NOT NULL,

    CONSTRAINT "CourseItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ProjectItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectTechnology" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "projectItemId" INTEGER NOT NULL,

    CONSTRAINT "ProjectTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Skill" (
    "id" SERIAL NOT NULL,
    "lang" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SkillCategory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "SkillCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SkillItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "skillCategoryId" INTEGER NOT NULL,

    CONSTRAINT "SkillItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contact_submissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."suggestions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hero_lang_key" ON "public"."Hero"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "Social_heroId_platform_key" ON "public"."Social"("heroId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_lang_key" ON "public"."Resume"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "About_lang_key" ON "public"."About"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "AboutDescription_aboutId_content_key" ON "public"."AboutDescription"("aboutId", "content");

-- CreateIndex
CREATE UNIQUE INDEX "AboutSkill_aboutId_name_key" ON "public"."AboutSkill"("aboutId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "AboutFeature_aboutId_title_key" ON "public"."AboutFeature"("aboutId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "ContactInfo_lang_key" ON "public"."ContactInfo"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "ContactSocial_contactInfoId_platform_key" ON "public"."ContactSocial"("contactInfoId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_lang_key" ON "public"."Experience"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceTechnology_experienceItemId_name_key" ON "public"."ExperienceTechnology"("experienceItemId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CourseItem_experienceId_name_org_key" ON "public"."CourseItem"("experienceId", "name", "org");

-- CreateIndex
CREATE UNIQUE INDEX "Project_lang_key" ON "public"."Project"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectItem_projectId_title_key" ON "public"."ProjectItem"("projectId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTechnology_projectItemId_name_key" ON "public"."ProjectTechnology"("projectItemId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_lang_key" ON "public"."Skill"("lang");

-- CreateIndex
CREATE UNIQUE INDEX "SkillCategory_skillId_title_key" ON "public"."SkillCategory"("skillId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "SkillItem_skillCategoryId_name_key" ON "public"."SkillItem"("skillCategoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "suggestion_name_unique" ON "public"."suggestions"("name");

-- AddForeignKey
ALTER TABLE "public"."Social" ADD CONSTRAINT "Social_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "public"."Hero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resume" ADD CONSTRAINT "Resume_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "public"."Hero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AboutDescription" ADD CONSTRAINT "AboutDescription_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "public"."About"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AboutSkill" ADD CONSTRAINT "AboutSkill_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "public"."About"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AboutFeature" ADD CONSTRAINT "AboutFeature_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "public"."About"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContactSocial" ADD CONSTRAINT "ContactSocial_contactInfoId_fkey" FOREIGN KEY ("contactInfoId") REFERENCES "public"."ContactInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExperienceItem" ADD CONSTRAINT "ExperienceItem_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExperienceTechnology" ADD CONSTRAINT "ExperienceTechnology_experienceItemId_fkey" FOREIGN KEY ("experienceItemId") REFERENCES "public"."ExperienceItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EducationItem" ADD CONSTRAINT "EducationItem_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseItem" ADD CONSTRAINT "CourseItem_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectItem" ADD CONSTRAINT "ProjectItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_projectItemId_fkey" FOREIGN KEY ("projectItemId") REFERENCES "public"."ProjectItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SkillCategory" ADD CONSTRAINT "SkillCategory_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SkillItem" ADD CONSTRAINT "SkillItem_skillCategoryId_fkey" FOREIGN KEY ("skillCategoryId") REFERENCES "public"."SkillCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
