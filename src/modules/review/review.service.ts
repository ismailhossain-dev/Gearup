import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";

const createReview = async (payload: ICreateReview, customerId: string) => {
  // 1. Check user
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: customerId,
    },
  });

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is suspended. Please contact support.");
  }

  if (user.role !== "CUSTOMER") {
    throw new Error("Only customers can submit reviews");
  }

  // 2. Validate rating
  if (
    !Number.isInteger(payload.rating) ||
    payload.rating < 1 ||
    payload.rating > 5
  ) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  // 3. Check gear
  const gear = await prisma.gear.findUnique({
    where: {
      id: payload.gearId,
    },
  });

  if (!gear) {
    throw new Error("Gear not found");
  }

  // 4. Create review
  const result = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,
      user: {
        connect: {
          id: customerId,
        },
      },
      gear: {
        connect: {
          id: payload.gearId,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      gear: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return result;
};

export const ReviewService = {
  createReview,
};

export const reviewService = {
  createReview,
};
