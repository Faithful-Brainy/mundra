import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma-client";

const staffRoles = new Set([
  "DEV",
  "PROP",
  "DIRECTOR",
  "ASSDIC",
  "PRINCIPAL",
  "VP",
  "BURSAR",
  "MANAGER",
  "REG",
  "TEACHER",
  "HEAD",
  "ASSHEAD",
  "SENMAST",
  "NURCOR",
  "ASSNURCOR",
  "GIUDE",
  "LIB",
  "ICT",
]);

export const teacherPanelSections = [
  {
    id: "scoresheet",
    title: "Scoresheet",
    summary: "Prepare CA and exam entries for each student from one teaching workspace.",
    points: [
      "Capture CA1, CA2, CA3, and exam scores.",
      "Review totals before publishing results.",
      "Keep one place for term-by-term score entry.",
    ],
  },
  {
    id: "student-report",
    title: "Student Report",
    summary: "Track report comments, progress summaries, and promotion notes.",
    points: [
      "Add teacher remarks for each learner.",
      "Review academic strengths and concerns.",
      "Prepare report notes for print or export later.",
    ],
  },
  {
    id: "attendance-register",
    title: "Attendance Register",
    summary: "Keep a simple daily register for class attendance and follow-up.",
    points: [
      "Mark present, absent, or late learners.",
      "Spot patterns that need quick intervention.",
      "Keep attendance review close to the teacher panel.",
    ],
  },
  {
    id: "class-list",
    title: "Class List",
    summary: "See the learner roster attached to the teacher's classroom work.",
    points: [
      "Review assigned students when class data is available.",
      "Use one location for student lookup and class checks.",
      "Prepare for subject-level filtering later.",
    ],
  },
  {
    id: "lesson-notes",
    title: "Lesson Notes",
    summary: "Keep lesson plans, topic flow, and daily teaching reminders together.",
    points: [
      "Outline the topic and lesson objective.",
      "Track what has been taught this term.",
      "Leave room for future uploads and approvals.",
    ],
  },
] as const;

export async function getTeacherAdminViewer() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  let payload: JwtPayload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }

  const userId = String(payload.id ?? "");

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      imageUrl: true,
      bio: true,
    },
  });

  if (!user || !staffRoles.has(user.role)) {
    return null;
  }

  return user;
}

export async function getTeacherAccounts() {
  return prisma.user.findMany({
    where: { role: "TEACHER" },
    orderBy: [{ name: "asc" }, { email: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      imageUrl: true,
      bio: true,
    },
  });
}

export async function getTeacherAccountById(id: string) {
  return prisma.user.findFirst({
    where: {
      id,
      role: "TEACHER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      imageUrl: true,
      bio: true,
    },
  });
}
