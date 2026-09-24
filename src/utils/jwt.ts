import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
};

//verify token 

const verifyToken = (refreshToken: string, secret: string) => {
  try {
    const verifyToken = jwt.verify(refreshToken, secret);
    return {
      success: true,
      data: verifyToken,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtilis = {
  createToken,
  verifyToken,
};
