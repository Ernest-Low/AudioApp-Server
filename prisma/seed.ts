import prisma from "./db/prisma";
import argon2 from "argon2";

const main = async () => {
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
          password: await argon2.hash("itsadeleteduser"),
          lowerEmail: "doesntexist.itsjustseeding.com",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { username: "Jerry" },
    update: {},
    create: {
      username: "Jerry",
      isPrivate: false,
      bio: "I'm Jerry~!",
      lowerUsername: "jerry",
      auth: {
        create: {
          email: "jerry.itsjustseeding.com",
          password: await argon2.hash("itsmejerry"),
          lowerEmail: "jerry.itsjustseeding.com",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { username: "Harry" },
    update: {},
    create: {
      username: "Jerry",
      isPrivate: true,
      bio: "I'm Harry~!",
      lowerUsername: "harry",
      auth: {
        create: {
          email: "harry.itsjustseeding.com",
          password: await argon2.hash("itsmeharry"),
          lowerEmail: "harry.itsjustseeding.com",
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
