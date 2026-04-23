const SUBJECT_LABELS: Record<string, string> = {
  BIO: "Biology",
  CHEM: "Chemistry",
  CIVIC: "Civic Education",
  COMM: "Commerce",
  COMP: "Computer Studies",
  ECONS: "Economics",
  ENG: "English",
  FURMATH: "Further Mathematics",
  GEO: "Geography",
  HOME: "Home Economics",
  ICT: "ICT",
  LIT: "Literature",
  MATH: "Mathematics",
  PHY: "Physics",
  REL: "Religious Studies",
  TD: "Technical Drawing",
};

export const ADMISSION_SUBJECT_PREFIX = "subject:";
export const ADMISSION_CLASS_PREFIX = "class:";

export function encodeAdmissionSubjectId(subjectId: number | string) {
  return `${ADMISSION_SUBJECT_PREFIX}${subjectId}`;
}

export function encodeAdmissionSelection(
  subjectId: number | string,
  classId?: number | string | null,
) {
  const encodedSubject = encodeAdmissionSubjectId(subjectId);

  if (classId === null || classId === undefined || `${classId}`.trim() === "") {
    return encodedSubject;
  }

  return `${encodedSubject}|${ADMISSION_CLASS_PREFIX}${classId}`;
}

export function decodeAdmissionSubjectId(value: string | null | undefined) {
  const normalized = (value ?? "").trim();

  if (!normalized.startsWith(ADMISSION_SUBJECT_PREFIX)) {
    return null;
  }

  const subjectPart = normalized
    .split("|")
    .find((part) => part.startsWith(ADMISSION_SUBJECT_PREFIX));

  if (!subjectPart) {
    return null;
  }

  const subjectId = Number.parseInt(
    subjectPart.slice(ADMISSION_SUBJECT_PREFIX.length),
    10,
  );

  return Number.isNaN(subjectId) ? null : subjectId;
}

export function decodeAdmissionAssignedClassId(value: string | null | undefined) {
  const normalized = (value ?? "").trim();

  if (!normalized) {
    return null;
  }

  if (!normalized.startsWith(ADMISSION_SUBJECT_PREFIX)) {
    const legacyClassId = Number.parseInt(normalized, 10);
    return Number.isNaN(legacyClassId) ? null : legacyClassId;
  }

  const classPart = normalized
    .split("|")
    .find((part) => part.startsWith(ADMISSION_CLASS_PREFIX));

  if (!classPart) {
    return null;
  }

  const classId = Number.parseInt(
    classPart.slice(ADMISSION_CLASS_PREFIX.length),
    10,
  );

  return Number.isNaN(classId) ? null : classId;
}

export function formatSubjectName(value: string | null | undefined) {
  const normalized = (value ?? "").trim().toUpperCase();

  if (!normalized) {
    return "Unknown Subject";
  }

  return SUBJECT_LABELS[normalized] ?? normalized;
}
