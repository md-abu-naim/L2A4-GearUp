import { prisma } from "../../lib/prisma.js"

const getAllGearsFromDB = async() => {
    const gears = await prisma.gearItem.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return gears
}

export const gearServices = {
    getAllGearsFromDB
}