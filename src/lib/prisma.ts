import dns from "node:dns";
import { PrismaClient } from "@prisma/client";

// Neon's hostname resolves to IPv6 (AAAA) addresses first, but many networks
// have no working IPv6 route to it. Node 17+ defaults to that DNS order, so the
// query engine intermittently tries an unreachable IPv6 address and fails with
// "Can't reach database server". Forcing IPv4-first makes connections reliable.
dns.setDefaultResultOrder("ipv4first");

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
