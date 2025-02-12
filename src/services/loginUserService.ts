import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { LoginUserDto, LoginUserResponseDto } from "../models/dtos/loginDtos";
import { CustomError } from "../utils/CustomError";
import { config } from "../config/config";
import prisma from "../../prisma/db/prisma";

const loginUserService = async (
  loginUserDto: LoginUserDto
): Promise<LoginUserResponseDto> => {
  const { username, password } = loginUserDto;

  const user = await prisma.user.findUnique({
    where: { username },
    include: { auth: true },
  });

  if (!user || !user.auth) {
    throw new CustomError("Invalid credentials", 401);
  }

  const isPasswordValid = await argon2.verify(user.auth.password, password);
  if (!isPasswordValid) {
    throw new CustomError("Invalid credentials", 401);
  }

  const token = jwt.sign({ userId: user.id }, config.AUTH_KEY, {
    expiresIn: "1h",
  });

  return {
    userId: user.id,
    username: user.username,
    jwtToken: token,
  };
};

export default loginUserService;
