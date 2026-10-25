import { prisma } from "../../lib/prisma";
import { IUserPayload } from "../auth/auth.interface";
import { IUpdateUser } from "./amdin.interface";

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const updateUser = async (
  userId: string,
  payload: IUpdateUser,
  adminId: string,
) => {
  // 1. Check user exists
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // 2. Prevent admin from updating their own account
  if (userId === adminId) {
    throw new Error("You cannot update your own role or status");
  }

  // 3. Validate role
  const allowedRoles = ["ADMIN", "PROVIDER", "CUSTOMER"];

  if (payload.role !== undefined && !allowedRoles.includes(payload.role)) {
    throw new Error("Invalid user role");
  }

  // 4. Validate status
  const allowedStatuses = ["ACTIVE", "SUSPENDED"];

  if (
    payload.status !== undefined &&
    !allowedStatuses.includes(payload.status)
  ) {
    throw new Error("Invalid user status");
  }

  // 5. Check update fields
  if (payload.role === undefined && payload.status === undefined) {
    throw new Error("No valid update fields provided");
  }

  // 6. Update user
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: payload.role,
      status: payload.status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getAllGears = async () => {
  const result = await prisma.gear.findMany();

  return result;
};
const getAllRentals = async () => {
  const result = await prisma.rentalOrder.findMany();

  return result;
};

export const amdinService = {
  getAllUsers,
  updateUser,
  getAllGears,
  getAllRentals,
};
