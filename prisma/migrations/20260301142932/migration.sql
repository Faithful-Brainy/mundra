/*
  Warnings:

  - You are about to drop the column `classId` on the `Ward` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT DEFAULT 'Unnamed',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '/cookie.png',
    "bio" TEXT NOT NULL DEFAULT 'Hi, Im A Mundra E-User',
    "role" TEXT NOT NULL DEFAULT 'PARENT'
);
INSERT INTO "new_User" ("bio", "email", "id", "imageUrl", "name", "password") SELECT "bio", "email", "id", "imageUrl", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Ward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'unnamed',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "class" TEXT,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '/chat.png',
    "bio" TEXT NOT NULL DEFAULT 'Hi, Im A Mundra E-Student',
    CONSTRAINT "Ward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ward" ("bio", "class", "id", "imageUrl", "name", "userId") SELECT "bio", "class", "id", "imageUrl", "name", "userId" FROM "Ward";
DROP TABLE "Ward";
ALTER TABLE "new_Ward" RENAME TO "Ward";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
