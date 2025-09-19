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

  // seed prodotti
  await prisma.product.createMany({
    data: [
      { name: "Prodotto A", sku: "A-100", price: 9.99, stock: 100 },
      { name: "Prodotto B", sku: "B-200", price: 19.99, stock: 50 },
    ],
    skipDuplicates: true,
  });

  // sample order (best-effort: only if customer exists and products exist)
  const customer = await prisma.user.findUnique({ where: { email: 'customer@test.com' } });
  const prodA = await prisma.product.findUnique({ where: { sku: 'A-100' } });
  const prodB = await prisma.product.findUnique({ where: { sku: 'B-200' } });

  if (customer && prodA && prodB) {
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        total: 29.98,
        status: 'completed',
        items: {
          create: [
            { productId: prodA.id, quantity: 1, unitPrice: prodA.price },
            { productId: prodB.id, quantity: 1, unitPrice: prodB.price },
          ],
        },
      },
      include: { items: true }
    });
  }
}

main()
  .then(() => console.log("✅ Utenti seed creati"))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
