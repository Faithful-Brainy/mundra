-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT DEFAULT 'Unnamed',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT 'https://imgs.search.brave.com/5tvut9Fhqyg5dTCw268jmfGARpWC22I-5h6a6Eu-IQo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJzLzc0NDc0/NS9zY3JlZW5zaG90/cy82NzA1MTE2L3By/b2ZpbGVfcGljX2Fy/bWFuXzR4LmpwZz9m/b3JtYXQ9d2VicCZy/ZXNpemU9NDAweDMw/MCZ2ZXJ0aWNhbD1j/ZW50ZXI',
    "bio" TEXT NOT NULL DEFAULT 'Hi, Im A Mundra E-User'
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Ward" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'unnamed',
    "class" TEXT,
    "classId" TEXT,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT 'https://imgs.search.brave.com/W4JKpfBDrFObjDcn-fsWd5UI135-lbtwl7_SiBwMlKg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdWJz/dGFja2Nkbi5jb20v/aW1hZ2UvZmV0Y2gv/JHNfIU5zMjIhLHdf/MTQ1NixjX2xpbWl0/LGZfYXV0byxxX2F1/dG86Z29vZCxmbF9w/cm9ncmVzc2l2ZTpz/dGVlcC9odHRwczov/L3N1YnN0YWNrLXBv/c3QtbWVkaWEuczMu/YW1hem9uYXdzLmNv/bS9wdWJsaWMvaW1h/Z2VzLzQyYjgwNjU5/LWJiMTctNGI1YS1h/NWU5LTE3NDAwODhm/NWE1ZV8yMzAxeDIz/MDEuanBlZw',
    "bio" TEXT NOT NULL DEFAULT 'Hi, Im A Mundra E-User',
    CONSTRAINT "Ward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ward" ("class", "classId", "id", "name", "userId") SELECT "class", "classId", "id", "name", "userId" FROM "Ward";
DROP TABLE "Ward";
ALTER TABLE "new_Ward" RENAME TO "Ward";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
