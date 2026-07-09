import { prisma } from "../../lib/prisma.js";

const createRentalIntoDB = async (payload: any, customerId: string) => {
    const customer = await prisma.user.findUnique({
        where: {
            id: customerId,
        },
    })

    if (!customer) {
        throw new Error("Please Login First. Then Try Again");
    }

    const gear = await prisma.gearItem.findUnique({
        where: {
            id: payload.gearItemId,
        },
    })

    if (!gear) {
        throw new Error("Gear not found. Please Enter a Gear ID");
    }

    if (gear.status !== "AVAILABLE") {
        throw new Error("Gear is unavailable")
    }

    if ((gear.stock ?? 0) < payload.quantity) {
        throw new Error("Insufficient stock")
    }

    const start = new Date(payload.startDate)
    const end = new Date(payload.endDate)

    if (start >= end) {
        throw new Error("End date must be greater than start date")
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (100 * 60 * 60 * 24) + 1)

    const totalPrice = gear.pricePerDay * days * payload.quantity

    const rentalTransaction = await prisma.$transaction(async(tx) => {
        const rental = await tx.rentalOrder.create({
            data: {
                customerId,
                gearItemId: payload.gearItemId,
                quantity: payload.quantity,
                startDate: start,
                endDate: end,
                totalPrice
            }
        })

        await tx.gearItem.update({
            where: {
                id: payload.gearItemId
            },
            data: {
                stock: {
                    decrement: payload.quantity
                }
            }
        })

        return rental
    })

    return {rentalTransaction}
}

const getAllRentalsFromDB = async(customerId: string) => {
    const rentals = await prisma.rentalOrder.findMany({
        where: {
            customerId
        }
    })

    return rentals
}

const getRentalsByIdFromDB = async(id: string) => {
    const rentals = await prisma.rentalOrder.findUnique({
        where: {
            id
        }
    })

    return rentals
}

export const rentalServices = {
    createRentalIntoDB, getAllRentalsFromDB,
    getRentalsByIdFromDB
}