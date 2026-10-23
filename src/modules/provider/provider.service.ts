import { prisma } from "../../lib/prisma";
import { ICreateGear } from "./provider.interface";

const createPost = async (payload: ICreateGear, customerId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: customerId,
    },
  });

  const result = await prisma.gear.create({
    data: {
      ...payload,
      providerId: customerId,
    },
  });

  return result;
};

export const providerService = {
  createPost,
};
