import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@gusto.local").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const customerEmail = (process.env.CUSTOMER_EMAIL || "guest@gusto.local").toLowerCase();
  const customerPassword = process.env.CUSTOMER_PASSWORD || "GuestPass123!";
  const customerName = process.env.CUSTOMER_NAME || "Guest User";
  const customerPhone = process.env.CUSTOMER_PHONE || "+976 99112233";
  const customerPasswordHash = await bcrypt.hash(customerPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
      role: "admin",
      name: "Admin",
      phone: null,
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "admin",
      name: "Admin",
    },
  });

  await prisma.user.upsert({
    where: { email: customerEmail },
    update: {
      passwordHash: customerPasswordHash,
      role: "customer",
      name: customerName,
      phone: customerPhone,
    },
    create: {
      email: customerEmail,
      passwordHash: customerPasswordHash,
      role: "customer",
      name: customerName,
      phone: customerPhone,
    },
  });

  const seedTables = [
    { tableNumber: 1, capacity: 2 },
    { tableNumber: 2, capacity: 2 },
    { tableNumber: 3, capacity: 4 },
    { tableNumber: 4, capacity: 4 },
    { tableNumber: 5, capacity: 2 },
    { tableNumber: 6, capacity: 6 },
    { tableNumber: 7, capacity: 4 },
    { tableNumber: 8, capacity: 8 },
    { tableNumber: 9, capacity: 6 },
    { tableNumber: 10, capacity: 4 },
    { tableNumber: 11, capacity: 2 },
    { tableNumber: 12, capacity: 2 },
  ];

  for (const table of seedTables) {
    await prisma.table.upsert({
      where: { tableNumber: table.tableNumber },
      update: {
        capacity: table.capacity,
        status: "available",
      },
      create: {
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        status: "available",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
