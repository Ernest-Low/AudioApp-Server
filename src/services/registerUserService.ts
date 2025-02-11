import { PrismaClient } from "@prisma/client";
import {
  RegisterUserDto,
  RegisterUserResponseDto,
} from "../models/dtos/registerDtos";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError";
import { config } from "../config/config";

const prisma = new PrismaClient();

const registerUserService = async (
  data: RegisterUserDto
): Promise<RegisterUserResponseDto> => {
  const { username, isPrivate, email, password } = data;

  const existingUser = await prisma.userAuth.findUnique({ where: { email } });
  if (existingUser) {
    throw new CustomError("Email is already in use", 400);
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        isPrivate,
        auth: {
          create: {
            email,
            password: await argon2.hash(password),
          },
        },
      },
      include: { auth: true },
    });

    const token = jwt.sign({ userId: user.id }, config.AUTH_KEY, {
      expiresIn: "1h",
    });

    return {
      userId: user.id,
      username: user.username,
      isPrivate: user.isPrivate,
      email: user.auth?.email ?? "",
      jwtToken: token,
    };

  } catch (error) {
    throw new CustomError("Failed to create user", 500, error);
  }
};

export default registerUserService;
