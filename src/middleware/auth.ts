import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtilis } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

// req.user এর error solve করার জন্য
declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        id: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Get token
    const token =
      req.cookies.accessToken ||
      (req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization);

    // Check token
    if (!token) {
      throw new Error(
        "You are not logged in. Please login to access this resource",
      );
    }

    // Verify token
    const verifyToken = jwtUtilis.verifyToken(
      token,
      config.jwt_access_secret,
    ) as JwtPayload;

    //   console.log(verifyToken)
    // Get user information from token
    const { name, email, role, id } = verifyToken.data;

    // Check role
    if (requiredRoles.length && !requiredRoles) {
      throw new Error(
        "Forbidden, You don't have permission to access this resource",
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    // User doesn't exist
    if (!user) {
      throw new Error("User not found, please create an account...");
    }

    // Suspended user
    if (user.status === "SUSPENDED") {
      throw new Error("Your account is suspended. Please contact support");
    }

    // Attach user to request
    req.user = {
      name,
      email,
      role,
      id,
    };

    next();
  });
};
