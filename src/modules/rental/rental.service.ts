import { prisma } from "../../lib/prisma";
import { ICreateRental } from "./rental.interface";

//only custome can create rental order
const createRental = async (payload: ICreateRental, customerId: string) => {
  const { gearId, quantity, startDate, endDate } = payload;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: customerId,
    },
  });

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is suspended. Please contact the support.");
  }

  if (user.role !== "CUSTOMER") {
    throw new Error("Only customers can create rental orders");
  }

  //Validate rental dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid rental date");
  }

  if (start >= end) {
    throw new Error("End date must be after start date");
  }

  //Validate quantity

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  //   Calculate rental duration
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const rentalDays = Math.ceil(
    (end.getTime() - start.getTime()) / millisecondsPerDay,
  );

  //Create rental and update stock in a transaction

  const result = await prisma.$transaction(async (tx) => {
    //Find gear

    const gear = await prisma.gear.findUnique({
      where: {
        id: gearId,
      },
    });

    if (!gear) {
      throw new Error("Gear not found");
    }

    //Check availability

    if (!gear.isAvailable) {
      throw new Error("This gear is not availabe");
    }

    // Check stock and reserve it atomically

    const updateGear = await tx.gear.updateMany({
      where: {
        id: gearId,
        isAvailable: true,
        availableStock: {
          gte: quantity,
        },
      },
      data: {
        availableStock: {
          decrement: quantity,
        },
      },
    });

    if (updateGear.count === 0) {
      throw new Error("Insufficient stock");
    }

    //Calculate total price

    const totalPrice = gear.pricePerDay * quantity * rentalDays;

    //Create rental order
    const rentalOrder = await tx.rentalOrder.create({
      data: {
        customerId: customerId,
        gearId: gearId,
        quantity: quantity,
        startDate: start,
        endDate: end,
        totalPrice: totalPrice,
        status: "PENDING",
      },
      include: {
        gear: {
          select: {
            id: true,
            name: true,
            pricePerDay: true,
            image: true,
          },
        },
      },
    });

    return rentalOrder;
  });

  return result;
};

const getMyRentals = async (customerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    include: {
      gear: {
        select: {
          id: true,
          name: true,
          image: true,
          pricePerDay: true,
          brand: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getRentalById = async (rentalId: string, customerId: string) => {
  const result = await prisma.rentalOrder.findFirst({
    where: {
      id: rentalId,
      customerId,
    },
    include: {
      gear: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          brand: true,
          pricePerDay: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!result) {
    throw new Error("Rental order not found");
  }

  return result;
};

export const rentalService = {
  createRental,
  getMyRentals,
  getRentalById,
};
