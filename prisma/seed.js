import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      { name: "Admin User", email: "admin@test.com", password: passwordHash, role: "admin" },
      { name: "Employee User", email: "employee@test.com", password: passwordHash, role: "employee" },
      { name: "Customer User", email: "customer@test.com", password: passwordHash, role: "customer" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log("✅ Utenti seed creati"))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
