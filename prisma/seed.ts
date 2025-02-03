import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Update all existing users to have 11 rest days
  await prisma.user.updateMany({
    data: {
      restDaysLeft: 11,
    },
  });

  console.log("Seed completed: Updated existing users with initial rest days");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
