import { prisma } from "../../lib/prisma";
import { ICreateGear } from "../gear/gear.interface";
import { IUpdateGear, IUpdateOrderStatus } from "./provider.interface";

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

const getProviderOrders = async (providerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      gear: {
        providerId,
      },
    },

    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },

      gear: {
        select: {
          id: true,
          name: true,
          image: true,
          pricePerDay: true,
          providerId: true,
        },
      },

      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};


const updateOrderStatus = async (
  orderId: string,
  providerId: string,
  payload: IUpdateOrderStatus
) => {
  const allowedStatuses = [
    "CONFIRMED",
    "ACTIVE",
    "COMPLETED",
    "CANCELLED",
  ] as const;

  if (
    !payload.status ||
    !allowedStatuses.includes(payload.status as typeof allowedStatuses[number])
  ) {
    throw new Error("Invalid rental order status");
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.rentalOrder.findFirst({
      where: {
        id: orderId,
        gear: {
          providerId,
        },
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new Error("Rental order not found");
    }

    if (order.status === payload.status) {
      throw new Error("Order already has this status");
    }

    // Define valid status transitions
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ["CANCELLED"],
      CONFIRMED: ["ACTIVE", "CANCELLED"],
      ACTIVE: ["COMPLETED"],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (
      !allowedTransitions[order.status]?.includes(payload.status)
    ) {
      throw new Error(
        `Cannot change order status from ${order.status} to ${payload.status}`
      );
    }

    // Only paid orders can become active
    if (
      payload.status === "ACTIVE" &&
      order.payment?.status !== "PAID"
    ) {
      throw new Error("Payment must be completed first");
    }

    // Return reserved stock on cancellation or completion
    if (
      payload.status === "CANCELLED" ||
      payload.status === "COMPLETED"
    ) {
      await tx.gear.update({
        where: {
          id: order.gearId,
        },
        data: {
          availableStock: {
            increment: order.quantity,
          },
        },
      });
    }

    const updatedOrder = await tx.rentalOrder.update({
      where: {
        id: orderId,
      },
      data: {
        status: payload.status,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gear: true,
        payment: true,
      },
    });

    return updatedOrder;
  });

  return result;
};
export const providerService = {
  createGear,
  updateGear,
  deleteGear,
  getProviderOrders,
  updateOrderStatus
};
