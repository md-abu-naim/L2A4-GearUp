import { UserStatus } from "../../../generated/prisma/enums.js"
import { prisma } from "../../lib/prisma.js"
import { IUpdateUser } from "./admin.interface.js"

const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        omit: {
            password: true
        }
    })

    return users
}

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

export const adminServices = {
    getAllUsersFromDB, updateUserFromDB
}