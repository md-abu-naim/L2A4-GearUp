import config from "../../config";
import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs";

const createUserIntoDB = async(payload: any) => {
    const {name, email, password} = payload
    
    const isUserExists = await prisma.user.findUnique({
        where: { email }
    })

    if (isUserExists) {
        throw new Error('User with this email already exists')
    }

    const hassedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hassedPassword
        },
        omit: {
            password: true
        }
    })

    return user
}

export const authServices = {
    createUserIntoDB
}