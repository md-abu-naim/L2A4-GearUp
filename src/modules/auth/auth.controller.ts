import { Request, Response } from "express"
import { authServices } from "./auth.services.js"
import { sendResponse } from "../../utils/sendResponse.js"
import httpStatus from "http-status";

const createUser = async (req: Request, res: Response) => {
    try {
        const payload = req.body
        const user = await authServices.createUserIntoDB(payload)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'User Registered Successfully',
            data: { user }
        })

    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const payload = req.body

        const { accessToken, refreshToken } = await authServices.loginUserIntoDB(payload)

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'User Login Successfully',
            data: { accessToken, refreshToken }
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })
    }
}


const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken

        const { accessToken } = await authServices.refreshToken(refreshToken)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7
        })

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Token Refreshed Successfully',
            data: { accessToken }
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })
    }
}

const getMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id

        const user = await authServices.getMyProfileFromDB(userId as string)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'My Profile Retrived Successfully',
            data: { user }
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })
    }
}

export const authController = {
    createUser, loginUser,
    refreshToken, getMyProfile
}