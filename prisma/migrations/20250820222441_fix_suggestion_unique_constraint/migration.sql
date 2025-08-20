-- RedefineIndex
DROP INDEX "suggestions_name_key";
CREATE UNIQUE INDEX "suggestion_name_unique" ON "suggestions"("name");
