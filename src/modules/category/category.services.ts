import { prisma } from "../../lib/prisma.js"
import { ICreateCategory, IUpdateCategory } from "./category.interface.js"

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

const getAllCategoriesFromDB =  async() => {
    const categories = await prisma.category.findMany({
        orderBy:{
            createdAt: "desc"
        }
    })

    return categories
}

const updateCategoryIntoDB = async(categoryId: string, payload: IUpdateCategory) => {
    const category = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: payload
    })

    return category
}

const deleteCategoryFromDB = async(categoryId: string) => {
    await prisma.category.delete({
        where: {
            id: categoryId
        }
    })

    return null
}

export const categoryServices = {
    createCategoryIntoDB, getAllCategoriesFromDB,
    updateCategoryIntoDB, deleteCategoryFromDB
}