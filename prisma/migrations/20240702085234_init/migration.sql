/*
  Warnings:

  - The primary key for the `QueueItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `QueueItem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QueueItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serverId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_QueueItem" ("createdAt", "link", "serverId") SELECT "createdAt", "link", "serverId" FROM "QueueItem";
DROP TABLE "QueueItem";
ALTER TABLE "new_QueueItem" RENAME TO "QueueItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
