import { prisma } from "../../lib/prisma";
import { ICreateGear, IUpdateGear } from "./provider.interface";

const createGear = async (payload: ICreateGear, authorId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: authorId,
    },
  });

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is suspend. please contact support..");
  }

  const result = await prisma.gear.create({
    data: {
      ...payload,
      providerId: authorId,
    },
  });

  return result;
};

const updateGear = async (
  payload: IUpdateGear,
  gearId: string,
  authorId: string,
  isProvider: boolean,
) => {
  const gear = await prisma.gear.findFirstOrThrow({
    where: {
      id: gearId,
    },
  });

  if (!isProvider && gear.providerId !== authorId) {
    throw new Error("You are not owner for this gear");
  }

  const result = await prisma.gear.update({
    where: {
      id: gearId,
    },
    data: payload,
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};

export const providerService = {
  createGear,
  updateGear,
};
