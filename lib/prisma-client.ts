import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = globalThis.prisma ?? new PrismaClient({adapter});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;