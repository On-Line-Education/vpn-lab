/*
  Warnings:

  - You are about to drop the column `userId` on the `Hub` table. All the data in the column will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hub" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "passHash" TEXT NOT NULL
);
INSERT INTO "new_Hub" ("createdAt", "id", "passHash", "title", "updatedAt") SELECT "createdAt", "id", "passHash", "title", "updatedAt" FROM "Hub";
DROP TABLE "Hub";
ALTER TABLE "new_Hub" RENAME TO "Hub";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "passHash" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "hubId" INTEGER,
    CONSTRAINT "User_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "Hub" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("id", "name", "passHash") SELECT "id", "name", "passHash" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
