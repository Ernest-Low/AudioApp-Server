import { CustomError } from "../utils/CustomError";
import prisma from "../../prisma/db/prisma";
import { UpdateProfileDto } from "../models/dtos/profileDtos";
import argon2 from "argon2";
import { ProfileResponseDto } from "../models/dtos/profileDtos";
import { formatSeconds } from "../utils/formatValues";

export const getProfileService = async (
  username: string,
  requesterId?: string
): Promise<ProfileResponseDto> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        lowerUsername: username.toLowerCase(),
      },
      include: {
        files: {
          select: {
            id: true,
            audioName: true,
            category: true,
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
      isPrivate: user.isPrivate,
      bio: user.bio,
      email: user.auth?.email,
      audioFiles: user.files.map((audio) => {
        return {
          audioId: audio.id,
          audioName: audio.audioName,
          category: audio.category,
          length: formatSeconds(audio.length),
        };
      }),
    };
  } catch (err: unknown) {
    if (err instanceof CustomError) {
      throw err;
    }
    throw new CustomError("Unknown error occurred", 500, err);
  }
};

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileDto
): Promise<ProfileResponseDto> => {
  const foundUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { auth: true },
  });

  if (!foundUser) {
    throw new CustomError("User not found", 404);
  }

  const userData: {
    username?: string;
    lowerUsername?: string;
    isPrivate?: boolean;
    bio?: string;
  } = {};
  const authData: { email?: string; lowerEmail?: string; password?: string } =
    {};

  if (data.username && data.username !== foundUser.username) {
    const existingUsername = await prisma.user.findUnique({
      where: { lowerUsername: data.username.toLowerCase() },
    });
    if (existingUsername) {
      throw new CustomError("Username is already in use", 400);
    }
    userData.username = data.username;
    userData.lowerUsername = data.username.toLowerCase();
  }
  if (data.isPrivate !== undefined && data.isPrivate !== foundUser.isPrivate) {
    userData.isPrivate = data.isPrivate;
  }
  if (data.bio !== undefined && data.bio !== foundUser.bio) {
    userData.bio = data.bio;
  }
  if (data.email && data.email !== foundUser.auth.email) {
    const existingEmail = await prisma.userAuth.findUnique({
      where: { lowerEmail: data.email.toLowerCase() },
    });
    if (existingEmail) {
      throw new CustomError("Email is already in use", 400);
    }
    authData.email = data.email;
    authData.lowerEmail = data.email.toLowerCase();
  }
  if (data.oldPassword && data.newPassword) {
    const valid = await argon2.verify(
      foundUser.auth.password,
      data.oldPassword
    );
    if (!valid) {
      throw new CustomError("Old password is incorrect", 400);
    }
    const hashedNewPassword = await argon2.hash(data.newPassword);
    authData.password = hashedNewPassword;
  }

  let updatedUser;
  try {
    updatedUser = await prisma.$transaction(async (tx) => {
      let updatedUserData = foundUser;
      if (Object.keys(userData).length > 0) {
        updatedUserData = await tx.user.update({
          where: { id: userId },
          data: userData,
          include: { auth: true },
        });
      }
      if (Object.keys(authData).length > 0) {
        await tx.userAuth.update({
          where: { id: foundUser.auth.id },
          data: authData,
        });
      }
      return updatedUserData;
    });

    const updatedProfile = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        files: {
          select: {
            id: true,
            audioName: true,
            category: true,
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

    if (!updatedProfile) {
      throw new CustomError("DB might've crashed", 500);
    }

    return {
      userId: updatedProfile.id,
      username: updatedProfile.username,
      isPrivate: updatedProfile.isPrivate,
      bio: updatedProfile.bio,
      email: updatedProfile.auth.email,
      audioFiles: updatedProfile.files.map((audio) => {
        return {
          audioId: audio.id,
          audioName: audio.audioName,
          category: audio.category,
          length: formatSeconds(audio.length),
        };
      }),
    };
  } catch (err: unknown) {
    throw new CustomError("Failed to update profile", 500, err);
  }
};

export const deleteProfileService = async (userId: string): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { files: true },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // DELETED_USER user should be seeded, but the userId has to be found
    const deletedUser = await tx.user.findUnique({
      where: { username: "DELETED_USER" },
    });

    if (!deletedUser) {
      throw new CustomError("DELETED_USER account not found", 500);
    }

    const publicFiles = user.files.filter((file) => file.isPublic);
    const nonPublicFiles = user.files.filter((file) => !file.isPublic);

    if (nonPublicFiles.length > 0) {
      const nonPublicFileIds = nonPublicFiles.map((file) => file.id);
      await tx.audioFile.deleteMany({
        where: { id: { in: nonPublicFileIds } },
      });
    }

    if (publicFiles.length > 0) {
      const publicFileIds = publicFiles.map((file) => file.id);
      await tx.audioFile.updateMany({
        where: { id: { in: publicFileIds } },
        data: { userId: deletedUser.id },
      });
    }

    await tx.user.delete({
      where: { id: userId },
    });
  });
};
