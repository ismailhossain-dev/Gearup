import { GearWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IGearQuery } from "./gear.interface";
const getAllGear = async (query: IGearQuery) => {
  const andConditions:GearWhereInput[] = [];

  // Search by name, description, brand and category
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          category: {
            some: {
              name: {
                contains: query.searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  // Filter by category
  if (query.category) {
    andConditions.push({
      category: {
        some: {
          name: {
            equals: query.category,
            mode: "insensitive",
          },
        },
      },
    });
  }

  // Filter by price
  if (query.price !== undefined) {
    andConditions.push({
      pricePerDay: {
        lte: Number(query.price),
      },
    });
  }

  // Filter by brand
  if (query.brand) {
    andConditions.push({
      brand: {
        equals: query.brand,
        mode: "insensitive",
      },
    });
  }

  const result = await prisma.gear.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
  });

  return result;
};

export const gearService = {
  getAllGear,
};
