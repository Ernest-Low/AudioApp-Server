import { CustomError } from "../utils/CustomError";
import prisma from "../../prisma/db/prisma";

export const getProfileService = async (
  username: string,
  requesterId?: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        lowerUsername: username.toLowerCase(),
      },
      include: {
        files: {
          select: {
            id: true,
            songName: true,
            length: true,
          },
        },
        auth: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!user) {
      throw new CustomError("Profile not found", 404);
    }

    if (user.isPrivate && user.id !== requesterId) {
      throw new CustomError("Profile is private", 403);
    }

    return {
      userId: user.id,
      username: user.username,
      email: user.auth?.email,
      bio: user.bio,
      audioFiles: user.files,
    };
  } catch (err: unknown) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("Unknown error occurred", 500, err);
  }
};
