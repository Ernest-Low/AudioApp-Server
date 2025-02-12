import {
  RegisterUserDto,
  RegisterUserResponseDto,
} from "../models/dtos/registerDtos";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError";
import { config } from "../config/config";
import prisma from "../../prisma/db/prisma";

const registerUserService = async (
  registerUserDto: RegisterUserDto
): Promise<RegisterUserResponseDto> => {
  const { username, isPrivate, email, password, bio } = registerUserDto;

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername) {
    throw new CustomError("Username is already in use", 400);
  }

  const existingEmail = await prisma.userAuth.findUnique({ where: { email } });
  if (existingEmail) {
    throw new CustomError("Email is already in use", 400);
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        isPrivate,
        bio: bio ? bio : "Blank bio",
        lowerUsername: username.toLowerCase(),
        auth: {
          create: {
            email,
            password: await argon2.hash(password),
            lowerEmail: email.toLowerCase(),
          },
        },
      },
      include: { auth: true },
    });

    const token = jwt.sign({ userId: user.id }, config.AUTH_KEY, {
      expiresIn: "1h",
    });

    // Refer to DTOs, there are better things to return
    return {
      userId: user.id,
      username: user.username,
      // isPrivate: user.isPrivate,
      // email: user.auth.email,
      // bio: user.bio,
      jwtToken: token,
    };
  } catch (error) {
    throw new CustomError("Failed to create user", 500, error);
  }
};

export default registerUserService;
