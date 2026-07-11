import { Prisma } from "../../../generated/prisma/client.js";
import { GearStatus } from "../../../generated/prisma/enums.js"
import { prisma } from "../../lib/prisma.js"
import { IQuery } from "./gear.interface.js";

const getAllGearsFromDB = async (query: IQuery) => {
    const { search, category, brand, availability, minPrice, maxPrice, } = query;

    const whereCondition: Prisma.GearItemWhereInput = {};

    if (search) {
        whereCondition.title = {
            contains: search,
            mode: "insensitive",
        };
    }

    if (category) {
        whereCondition.category = {
            equals: category,
            mode: "insensitive"
        };
    }

    if (brand) {
        whereCondition.brand = {
            equals: brand,
            mode: "insensitive",
        };
    }

    if (availability) {
        whereCondition.status = availability as GearStatus;
    }

    if (minPrice || maxPrice) {
        whereCondition.pricePerDay = {};

        if (minPrice) {
            whereCondition.pricePerDay.gte = Number(minPrice);
        }

        if (maxPrice) {
            whereCondition.pricePerDay.lte = Number(maxPrice);
        }
    }

    const gears = await prisma.gearItem.findMany({
        where: whereCondition,
        include: {
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return gears
}

const getGearByIdFromDB = async (id: string) => {
    const gear = await prisma.gearItem.findUnique({
        where: {
            id
        },
        include: {
            provider: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            }
        }
    })

    return gear
}

export const gearServices = {
    getAllGearsFromDB, getGearByIdFromDB
}