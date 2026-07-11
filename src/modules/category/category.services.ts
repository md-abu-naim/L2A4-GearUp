import { prisma } from "../../lib/prisma.js"

const getAllCategoriesFromDB = async () => {
    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })

    return categories
}


export const categoryServices = {
     getAllCategoriesFromDB,
}