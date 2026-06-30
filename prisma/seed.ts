import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const tables = [
  // Floor map slots (SLOT_TO_DBNUM in RestaurantFloorMap.tsx)
  { tableNumber: 1,  capacity: 4 },  // A-1  round
  { tableNumber: 2,  capacity: 4 },  // A-2  round
  { tableNumber: 3,  capacity: 6 },  // D-3  round
  { tableNumber: 4,  capacity: 6 },  // D-4  round
  { tableNumber: 5,  capacity: 4 },  // A-3  round
  { tableNumber: 6,  capacity: 3 },  // C-4  booth
  { tableNumber: 7,  capacity: 6 },  // D-5  round
  { tableNumber: 8,  capacity: 8 },  // VIP-1 vip
  { tableNumber: 9,  capacity: 3 },  // D-7  booth
  { tableNumber: 10, capacity: 2 },  // B-4  booth
  { tableNumber: 11, capacity: 4 },  // A-4  round
  { tableNumber: 12, capacity: 4 },  // B-1  round
  { tableNumber: 13, capacity: 4 },  // C-3  rect
  { tableNumber: 14, capacity: 4 },  // C-2  rect
  { tableNumber: 15, capacity: 6 },  // C-1  round
  { tableNumber: 16, capacity: 3 },  // D-8  booth
  { tableNumber: 17, capacity: 6 },  // D-6  round
  { tableNumber: 18, capacity: 6 },  // D-2  round
  { tableNumber: 19, capacity: 2 },  // D-1  booth
  { tableNumber: 20, capacity: 2 },  // D-9  rect
  { tableNumber: 21, capacity: 2 },  // D-10 rect
  { tableNumber: 22, capacity: 8 },  // VIP-2 vip
  { tableNumber: 23, capacity: 4 },  // A-5  round
  { tableNumber: 24, capacity: 4 },  // A-6  round
  { tableNumber: 25, capacity: 4 },  // A-7  round
  { tableNumber: 26, capacity: 4 },  // A-8  round
  { tableNumber: 27, capacity: 4 },  // A-9  round
  { tableNumber: 28, capacity: 6 },  // B-3  rect
  { tableNumber: 29, capacity: 2 },  // B-5  booth
  { tableNumber: 30, capacity: 6 },  // B-2  rect
  { tableNumber: 31, capacity: 2 },  // B-6  booth
  // Extra tables (not on floor map)
  { tableNumber: 32, capacity: 2 },
  { tableNumber: 33, capacity: 2 },
  { tableNumber: 34, capacity: 4 },
  { tableNumber: 35, capacity: 4 },
  { tableNumber: 36, capacity: 4 },
  { tableNumber: 37, capacity: 4 },
  { tableNumber: 38, capacity: 6 },
  { tableNumber: 39, capacity: 6 },
  { tableNumber: 40, capacity: 6 },
  { tableNumber: 41, capacity: 6 },
  { tableNumber: 42, capacity: 8 },
  { tableNumber: 43, capacity: 8 },
];

const demoUsers = [
  { name: "Admin",    email: "admin@gusto.com",    password: "Admin123!",    role: "ADMIN"    as const },
  { name: "Staff",    email: "staff@gusto.com",    password: "Staff123!",    role: "STAFF"    as const },
  { name: "Customer", email: "customer@gusto.com", password: "Customer123!", role: "CUSTOMER" as const },
];

async function main() {
  console.log("Seeding tables...");
  for (const t of tables) {
    await prisma.table.upsert({
      where:  { tableNumber: t.tableNumber },
      update: { capacity: t.capacity },
      create: { tableNumber: t.tableNumber, capacity: t.capacity, status: "AVAILABLE" },
    });
  }
  console.log(`✓ ${tables.length} tables seeded.`);

  console.log("\nSeeding demo users...");
  for (const u of demoUsers) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where:  { email: u.email },
      update: { name: u.name, password: hashed, role: u.role },
      create: { name: u.name, email: u.email, password: hashed, role: u.role },
    });
    console.log(`  ✓ ${u.role.padEnd(8)} — ${u.email}  /  ${u.password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
