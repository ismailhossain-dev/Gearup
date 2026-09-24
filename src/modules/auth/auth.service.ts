import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtilis } from "../../utils/jwt";
import { IUserLoginPayload, IUserPayload } from "./auth.interface";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

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

//verify token and block user (most important)
const refreshToken = async (refreshToken: string) => {
  const verifyToken = jwtUtilis.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  );

  if (!verifyToken.success) {
    throw new Error(verifyToken.error);
  }

  // console.log(verifyToken)
  const { id } = verifyToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  // console.log(user)

  if (user.status === "SUSPENDED") {
    throw new Error("Your account is suspended. Plase connect support");
  }

  //create new token for given user
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    reole: user.role,
  };

  const accessToken = jwtUtilis.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken };
};


const getMyProfileFromDB = async(userId:string)=> {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    },
    omit: {
      password: true
    }
  })

  return user; 

}

export const authService = {
  registerUserIntoDB,
  loginUser,
  refreshToken,
  getMyProfileFromDB
};
