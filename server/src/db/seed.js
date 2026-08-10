import "dotenv/config";
import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    throw new Error(
      "ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set.",
    );
  }

  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.upsert({
    where: {
      email: normalizedEmail,
    },

    update: {
      username: normalizedUsername,
      role: "ADMIN",
    },

    create: {
      username: normalizedUsername,
      email: normalizedEmail,
      role: "ADMIN",
    },
  });

  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "LOCAL",
        providerAccountId: normalizedEmail,
      },
    },

    update: {
      passwordHash,
      userId: user.id,
    },

    create: {
      provider: "LOCAL",
      providerAccountId: normalizedEmail,
      passwordHash,
      userId: user.id,
    },
  });

  console.log("Admin user seeded successfully.");
  console.log(`Username: ${user.username}`);
  console.log(`Email: ${user.email}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
