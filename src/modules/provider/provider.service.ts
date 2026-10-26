import { prisma } from "../../lib/prisma";
import { ICreateGear } from "../gear/gear.interface";
import { IUpdateGear } from "./provider.interface";

const createGear = async (payload: ICreateGear, authorId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
    },
  });

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is suspended");
  }

  const result = await prisma.gear.create({
    data: {
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      image: payload.image,
      pricePerDay: payload.pricePerDay,
      stock: payload.stock,
      availableStock: payload.stock,
      isAvailable: payload.stock > 0,

      user: {
        connect: { id: authorId },
      },
      category: {
        connect: { id: payload.categoryId },
      },
    },
    include: {
      category: true,
    },
  });

  return result;
};

const updateGear = async (
  payload: IUpdateGear,
  gearId: string,
  providerId: string,
) => {
  console.log("gearId", gearId);
  const result = await prisma.$transaction(async (tx) => {
    // 1. Find gear and verify ownership
    const gear = await tx.gear.findFirst({
      where: {
        id: gearId,
        providerId,
      },
    });

    if (!gear) {
      throw new Error("Gear not found or access denied");
    }

    // 2. Validate price
    if (
      payload.pricePerDay !== undefined &&
      (!Number.isInteger(payload.pricePerDay) || payload.pricePerDay <= 0)
    ) {
      throw new Error("Price must be a positive integer");
    }

    // 3. Validate stock
    let availableStock = gear.availableStock;

    if (payload.stock !== undefined) {
      if (!Number.isInteger(payload.stock) || payload.stock < 0) {
        throw new Error("Stock must be a non-negative integer");
      }

      // Existing reserved quantity
      const reservedStock = gear.stock - gear.availableStock;

      if (payload.stock < reservedStock) {
        throw new Error(
          "Stock cannot be less than currently reserved quantity",
        );
      }

      availableStock = payload.stock - reservedStock;
    }

    // 4. Update only allowed fields
    const updatedGear = await tx.gear.update({
      where: {
        id: gearId,
      },
      data: {
        name: payload.name,
        description: payload.description,
        brand: payload.brand,
        image: payload.image,
        pricePerDay: payload.pricePerDay,
        stock: payload.stock,
        availableStock,
        categoryId: payload.categoryId,
      },
    });

    return updatedGear;
  });

  return result;
};

const deleteGear = async (gearId: string, providerId: string) => {
  const gear = await prisma.gear.findFirst({
    where: {
      id: gearId,
      providerId,
    },
  });
  if (!gear) {
    throw new Error("Gear not found or access defind");
  }

  const result = await prisma.gear.delete({
    where: {
      id: gearId,
    },
  });

  return result;
};

export const providerService = {
  createGear,
  updateGear,
  deleteGear
};
