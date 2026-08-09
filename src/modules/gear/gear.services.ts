import { Prisma } from "../../../generated/prisma/client.js";
import { GearStatus, RentalStatus } from "../../../generated/prisma/enums.js"
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

const getFeaturedGearFromDB = async () => {
    const gear = await prisma.gearItem.findMany({
        take: 6
    })

    return gear
}

const getPopularGearFromDB = async () => {
    const popular = await prisma.rentalOrder.groupBy({
        by: ["gearItemId"],
        where: {
            status: {
                in: [RentalStatus.PICKED_UP, RentalStatus.RETURNED],
            },
        },
        _count: {
            gearItemId: true,
        },
        orderBy: {
            _count: {
                gearItemId: "desc",
            },
        },
        take: 6,
    });

    const gearIds = popular.map((item) => item.gearItemId);

    const gears = await prisma.gearItem.findMany({
        where: {
            id: {
                in: gearIds,
            },
        },
    });


    return gears.map((gear) => {
        const countInfo = popular.find((item) => item.gearItemId === gear.id);
        return {
            ...gear,
            totalRented: countInfo?._count.gearItemId || 0,
        };
    }).sort((a, b) => b.totalRented - a.totalRented);
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
    getAllGearsFromDB, getGearByIdFromDB,
    getFeaturedGearFromDB, getPopularGearFromDB
}