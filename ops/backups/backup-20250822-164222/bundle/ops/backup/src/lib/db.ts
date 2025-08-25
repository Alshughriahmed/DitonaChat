import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  g.prisma ??
  new PrismaClient({
    log: process.env.PRISMA_LOG?.split(",") as any || ["error"],
  });

if (process.env.NODE_ENV !== "production") g.prisma = prisma;
