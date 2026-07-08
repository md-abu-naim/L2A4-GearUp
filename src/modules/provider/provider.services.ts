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

const updateGearIntoDB = async(payload: IUpdateGear, gearId: string) => {
    const gear = await prisma.gearItem.update({
        where: {
            id: gearId
        },
        data: payload
    })

    return gear
}

export const providerServices = {
    createGearIntoDB, updateGearIntoDB
}