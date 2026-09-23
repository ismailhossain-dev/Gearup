import bcrypt from "bcryptjs";
import { IUserPayload } from "./user.interface";
import { prisma } from "../../lib/prisma";
import config from "../../config";

const registerUserIntoDB = async (payload: IUserPayload) => {
  const { name, email, password, profilePhoto, phone } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error("User with email already exists ");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      profilePhoto,
      phone,
    },
  });

  //user get for response

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: createUser.id,
      email: createUser.email,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const userService = {
  registerUserIntoDB,
};
