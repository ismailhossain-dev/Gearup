import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";

const createCategory = async (payload:ICategory)=> {
    //category must be uniq
    const existingCategory = await prisma.category.findUnique({
        where: {
            name : payload.name
        }
    })

    if(existingCategory){
        throw new Error("Category already exists")
    }

    const result = await prisma.category.create({
        data: {
            name: payload.name,
            description: payload.description,
            image: payload.image
        }
    })

    return result;
}

export const categoryService ={
    createCategory
}