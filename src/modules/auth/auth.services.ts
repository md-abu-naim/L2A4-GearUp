import config from "../../config";
import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs";
import { ICreatUser, ILoginUser } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { jwtUtils } from "../../utils/jwt";

const createUserIntoDB = async (payload: ICreatUser) => {
    const { name, email, password, role, status, phone, profileImage } = payload

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
            password: hassedPassword,
            role,
            status,
            phone,
            profileImage
        },
        omit: {
            password: true
        }
    })

    return user
}

const loginUserIntoDB = async (payload: ILoginUser) => {
    const { email, password } = payload

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

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions)

    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expires_in as SignOptions)

    return { accessToken, refreshToken }
}

const refreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if (!verifiedRefreshToken.success) {
        throw new Error(verifiedRefreshToken.error)
    }

    const { id } = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    if (user.status === "SUSPENDED") {
        throw new Error("User is SUSPENDED!")
    }

    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    return { accessToken }
}

const getMyProfileFromDB = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    })

    return user
}

export const authServices = {
    createUserIntoDB, loginUserIntoDB,
    refreshToken, getMyProfileFromDB
}