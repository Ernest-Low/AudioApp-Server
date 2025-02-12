import prisma from "./db/prisma";
import argon2 from "argon2";

const main = async () => {
  const hashedPassword = await argon2.hash("itsadeleteduser");

  await prisma.user.upsert({
    where: { username: "DELETED_USER" },
    update: {},
    create: {
      username: "DELETED_USER",
      isPrivate: true,
      bio: "Don't look",
      lowerUsername: "deleted_user",
      auth: {
        create: {
          email: "doesntexist.itsjustseeding.com",
          password: hashedPassword,
          lowerEmail: "doesntexist.itsjustseeding.com",
        },
      },
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
