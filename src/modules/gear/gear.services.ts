import { prisma } from "../../lib/prisma.js"

const getAllGearsFromDB = async() => {
    const gears = await prisma.gearItem.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return gears
}

const getGearByIdFromDB = async(id: string) => {
    const gear =await prisma.gearItem.findUnique({
        where: {
            id
        }
    })

    return gear
}

export const gearServices = {
    getAllGearsFromDB, getGearByIdFromDB
}