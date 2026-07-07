import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import config from "../config/index.js";
import { UserRole } from "../../generated/prisma/enums.js";
import { jwtUtils } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";
import httpStatus from "http-status";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                name: string,
                email: string,
                role: UserRole
            }
        }
    }
}

const auth = (...roles: UserRole[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization?.split(" ")[1]
                : req.headers.authorization

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized access!!",
            })
        }

        const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret)

        if (!verifyToken.success) {
            res.status(401).json({
                success: false,
                message: "Unauthorized access!!",
            })
        }

        const { email, name, id, role } = verifyToken.data as JwtPayload

        const user = await prisma.user.findUnique({
            where: {
                id, email, name, role
            }
        })

        if (!user) {
            res.status(401).json({
                success: false,
                message: "User not found. Pleas login again",
            })
        }

        if (roles?.length && !roles.includes(role)) {
            res.status(httpStatus.FORBIDDEN).json({
                success: false,
                statusCode: httpStatus.FORBIDDEN,
                message: 'Forbidden. You dont have permission to access this recource'
            })
        }

        req.user = {
            id, email, name, role
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        })
    }
}

export default auth