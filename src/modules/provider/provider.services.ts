import { RentalStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { IGear, IUpdateGear } from "./provider.interface.js";

const createGearIntoDB = async (payload: IGear, providerId: string) => {
    const category = await prisma.category.findUniqueOrThrow({
        where: {
            name: payload.category,
        },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    const provider = await prisma.user.findUniqueOrThrow({
        where: {
            id: providerId,
        }
    })

    if (provider.role !== "PROVIDER") {
        throw new Error("Only providers can add gear");
    }

    const gear = await prisma.gearItem.create({
        data: {
            ...payload,
            providerId
        },
    });

    return gear
}

const updateGearIntoDB = async (payload: IUpdateGear, gearId: string) => {
    const gear = await prisma.gearItem.update({
        where: {
            id: gearId
        },
        data: payload,
    })

    return gear
}

const deleteGearFromDB = async (id: string) => {
    await prisma.gearItem.delete({
        where: {
            id,
        },
    });
}

const getAllRentalsFromDB = async () => {
    const rentals = await prisma.rentalOrder.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return rentals
}

const updateRentalStatusFromDB = async (rentalId: string, providerId: string, payload: { status: RentalStatus }) => {
    const allowedFields = ["status"];

    const payloadKeys = Object.keys(payload);

    if (payloadKeys.length !== 1 || !allowedFields.includes(payloadKeys[0]!)) {
        throw new Error("Only status can be updated.");
    }

    const status = payload.status.toUpperCase() as RentalStatus;

    if (!Object.values(RentalStatus).includes(status)) {
        throw new Error("Invalid status. Status must be CONFIRMED, PICKED_UP, RETURNED, or CANCELLED.");
    }

    const rental = await prisma.rentalOrder.findUnique({
        where: {
            id: rentalId,
        },
        include: {
            gearItem: true,
        },
    });

    if (!rental) {
        throw new Error("Rental not found");
    }

    // if (rental.gearItem.providerId !== providerId) {
    //     throw new Error("You are not authorized to update this rental")
    // }

    const result = await prisma.rentalOrder.update({
        where: {
            id: rentalId,
        },
        data: {
            status
        }
    });

    return result;
}

export const providerServices = {
    createGearIntoDB, updateGearIntoDB,
    deleteGearFromDB, getAllRentalsFromDB,
    updateRentalStatusFromDB
}