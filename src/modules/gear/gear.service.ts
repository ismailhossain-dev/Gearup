import { GearWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IGearQuery } from "./gear.interface";



const getAllGear = async (query: IGearQuery) => {
  const andConditions: GearWhereInput[] = [];

  // 1. Search by name, description, brand and category
  if (query.searchTerm?.trim()) {
    const searchTerm = query.searchTerm.trim();

    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          category: {
            is: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  //  Filter by category name
  if (query.category?.trim()) {
    andConditions.push({
      category: {
        is: {
          name: {
            equals: query.category.trim(),
            mode: "insensitive",
          },
        },
      },
    });
  }


  // Filter by maximum price
  if (query.price !== undefined) {
    const price = Number(query.price);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Invalid price");
    }

    andConditions.push({
      pricePerDay: {
        lte: price,
      },
    });
  }
  //  Filter by brand
  if (query.brand?.trim()) {
    andConditions.push({
      brand: {
        equals: query.brand.trim(),
        mode: "insensitive",
      },
    });
  }

  // Get filtered gears
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
const getGearById = async (gearId: string) => {
  const result = await prisma.gear.findUniqueOrThrow({
    where: {
      id: gearId,
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


const getAllGearCategory = async()=> {
  const result = await prisma.category.findMany({
    include: {
      gears: true
    }
  });

  return result
}

export const gearService = {
  getAllGear,
  getGearById,
  getAllGearCategory
};
