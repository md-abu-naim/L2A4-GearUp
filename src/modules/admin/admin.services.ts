import { UserStatus } from "../../../generated/prisma/enums.js"
import { prisma } from "../../lib/prisma.js"
import { ICreateCategory, IUpdateCategory, IUpdateUser } from "./admin.interface.js"

type Query = {
    search?: string;
    page?: string;
    limit?: string;
};

const getAllUsersFromDB = async (query: Query) => {
    const search = (query.search as string) || "";
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const where = search ?
        {
            name: {
                contains: search,
                mode: "insensitive" as const,
            },
        }
        : {};

    const users = await prisma.user.findMany({
        where,
        skip,
        take: limit,
        omit: {
            password: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const total = await prisma.user.count();

    const activeUsers = await prisma.user.count({
        where: {
            status: "ACTIVE",
        },
    });

    const suspendedUsers = await prisma.user.count({
        where: {
            status: "SUSPENDED",
        },
    });

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
            activeUsers,
            suspendedUsers
        },
        users,
    };
};

const updateUserFromDB = async (userId: string, payload: IUpdateUser) => {
    const allowedFields = ["status"];

    const payloadKeys = Object.keys(payload);

    if (payloadKeys.length !== 1 || !allowedFields.includes(payloadKeys[0]!)) {
        throw new Error("Only status can be updated.");
    }

    const status = payload.status.toUpperCase() as UserStatus;

    if (!Object.values(UserStatus).includes(status)) {
        throw new Error("Invalid status. Status must be ACTIVE or SUSPENDED.");
    }

    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status
        },
        omit: {
            password: true
        }
    })

    return user
}

const getAllGearsFromDB = async () => {
    const gears = await prisma.gearItem.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            provider: true
        }
    })

    return gears
}

const getAllRentalsFromDB = async () => {
    const rentals = await prisma.rentalOrder.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            gearItem: true
        }
    })

    return rentals
}

const createCategoryIntoDB = async (payload: ICreateCategory) => {
    const isCategoryExists = await prisma.category.findUnique({
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

const updateCategoryIntoDB = async (categoryId: string, payload: IUpdateCategory) => {
    const category = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: payload
    })

    return category
}

const deleteCategoryFromDB = async (categoryId: string) => {
    await prisma.category.delete({
        where: {
            id: categoryId
        }
    })

    return null
}


export const adminServices = {
    getAllUsersFromDB, updateUserFromDB,
    getAllGearsFromDB, getAllRentalsFromDB,
    createCategoryIntoDB, updateCategoryIntoDB,
    deleteCategoryFromDB
}