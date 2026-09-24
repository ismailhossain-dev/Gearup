import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtilis } from "../../utils/jwt";
import { IUserLoginPayload } from "./auth.interface";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
const loginUser = async (payload: IUserLoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incarrect");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtilis.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtilis.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
};
