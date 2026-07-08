import { prisma } from "../../lib/prisma.js"
import { ICreateCategory } from "./category.interface.js"

const createCategoryIntoDB = async (payload: ICreateCategory) => {
    const isCategoryExists =await prisma.category.findUnique({
        where: {
            name: payload.name
        }
    })

    if (isCategoryExists) {
        throw new Error("Category already exists");
    }

    const categroy = await prisma.category.create({
        data: payload
    })

    return categroy
}

export const categoryServices = {
    createCategoryIntoDB
}