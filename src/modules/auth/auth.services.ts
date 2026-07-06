import config from "../../config";
import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs";
import { ICreatUser, ILoginUser } from "./auth.interface";

const createUserIntoDB = async(payload: ICreatUser) => {
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

const loginUserIntoDB = async(payload: ILoginUser) => {
    const {email, password} = payload

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    if (user.status === "SUSPENDED") {
        throw new Error('Your account has been blocked. Pleas contact support')
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password)

    if (!isMatchedPassword) {
        throw new Error('Password is Incorrect')
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    return jwtPayload
}

export const authServices = {
    createUserIntoDB, loginUserIntoDB
}