import { prisma } from "@/lib/prisma.ts";
import { generatePasswordHash } from "@/utils/generator.ts";
import { faker } from "@faker-js/faker";
import { UserRole } from "@prisma/client";

async function main() {
  // Create Users
  const superadmin = await prisma.user.create({
    data: {
      name: faker.person.fullName().slice(0, 90),
      email: faker.internet.email(),
      cpf: faker.string.numeric(14),
      phone: faker.phone.number(),
      passwordHash: await generatePasswordHash("superadmin123"),
      role: UserRole.SUPERADMIN,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.string.numeric(14),
      phone: faker.phone.number(),
      passwordHash: await generatePasswordHash("admin123"),
      role: UserRole.ADMIN,
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      cpf: faker.string.numeric(14),
      phone: faker.phone.number(),
      passwordHash: await generatePasswordHash("employee123"),
      role: UserRole.EMPLOYEE,
    },
  });

  // Create Network
  const network = await prisma.network.create({
    data: {
      name: faker.company.name(),
      ownerId: superadmin.id,
    },
  });

  // Create Store
  const store = await prisma.store.create({
    data: {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      networkId: network.id,
    },
  });

  // Create Products
  const products = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
          price: parseFloat(faker.commerce.price()),
          stock: faker.number.int({ min: 1, max: 100 }),
          expirationDate: faker.date.future(),
          storeId: store.id,
        },
      })
    )
  );

  // Create Sales
  await Promise.all(
    products.map((product) =>
      prisma.sale.create({
        data: {
          storeId: store.id,
          productId: product.id,
          quantity: faker.number.int({ min: 1, max: 5 }),
          saleDate: faker.date.recent(),
          totalPrice: product.price * 2,
        },
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
