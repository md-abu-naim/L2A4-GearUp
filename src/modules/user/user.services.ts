import { prisma } from "../../lib/prisma.js"

const updateUserProfileIntoDB = async(payload: any, userId: string) => {
    const {name, phone, profileImage} = payload
    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name, phone, profileImage
        },
        omit: {
            password: true
        }
    })

    return user
}

const deleteUserFromDB = async(userId: string) => {
    const user = await prisma.user.delete({
        where: {
            id: userId
        }
    })

    return null
}

export const userService = {
    updateUserProfileIntoDB, deleteUserFromDB
}