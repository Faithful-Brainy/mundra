-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('BOY', 'GIRL', 'UNID', 'TRANS');

-- CreateEnum
CREATE TYPE "Rel" AS ENUM ('GUARDIAN', 'KIN', 'PARENT', 'ADOPTIVE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PARENT', 'SENMAST', 'NURCOR', 'ASSNURCOR', 'HEAD', 'ASSHEAD', 'STUDENT', 'TEACHER', 'PRINCIPAL', 'REG', 'DIRECTOR', 'ASSDIC', 'BURSAR', 'MANAGER', 'VP', 'GIUDE', 'LIB', 'ICT', 'PROP', 'DEV');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ART', 'SCIENCE', 'COMMERCIAL', 'SOCIAL', 'GENERAL');

-- CreateEnum
CREATE TYPE "NewsType" AS ENUM ('ANNOUNCEMENT', 'NEWS', 'NEWSLETTER', 'URGENT', 'EVENT');

-- CreateEnum
CREATE TYPE "NewsTarget" AS ENUM ('PARENT', 'STUDENT', 'STAFF', 'GENERAL', 'MANAGEMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT DEFAULT 'Unnamed',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '/cookie.png',
    "bio" TEXT DEFAULT 'Hi, Im A Mundra E-User',
    "role" "Role" NOT NULL DEFAULT 'PARENT',
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ward" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'unnamed',
    "passKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "classId" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT '/chat.png',
    "bio" TEXT NOT NULL DEFAULT 'Hi, Im A Mundra E-Student',
    "ser" INTEGER,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "queryCount" TEXT NOT NULL,
    "subjects" TEXT NOT NULL,
    "isMaster" BOOLEAN NOT NULL,
    "ofClass" TEXT NOT NULL,
    "subjName" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "subClass" TEXT NOT NULL,
    "master" TEXT NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subjects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "ca1" INTEGER NOT NULL,
    "ca2" INTEGER NOT NULL,
    "ca3" INTEGER NOT NULL,
    "exam" INTEGER NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'GENERAL',

    CONSTRAINT "Subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" "NewsType" NOT NULL DEFAULT 'NEWS',
    "for" "Role" NOT NULL,

    CONSTRAINT "NewsItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "gend" "Gender",
    "state" TEXT,
    "rel" "Rel",
    "parName" TEXT,
    "prevSch" TEXT,

    CONSTRAINT "Admission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassToTeacher" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassToTeacher_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subjects_name_key" ON "Subjects"("name");

-- CreateIndex
CREATE INDEX "_ClassToTeacher_B_index" ON "_ClassToTeacher"("B");

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_subjName_fkey" FOREIGN KEY ("subjName") REFERENCES "Subjects"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subjects" ADD CONSTRAINT "Subjects_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToTeacher" ADD CONSTRAINT "_ClassToTeacher_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToTeacher" ADD CONSTRAINT "_ClassToTeacher_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
