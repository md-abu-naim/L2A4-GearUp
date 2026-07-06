import { Request, Response } from "express"
import { authServices } from "./auth.services"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status";

const createUser = async (req: Request, res: Response) => {
    const payload = req.body
    console.log(payload, 'from controller');
    const user = await authServices.createUserIntoDB(payload)
    console.log(user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User Registered Successfully',
        data: { user }
    })
}

const loginUser = async (req: Request, res: Response) => {
    const payload = req.body
    console.log(payload);

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
}


const refreshToken = async (req: Request, res: Response) => {
    console.log(req.user);
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
}

const getMyProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id

    const user = await authServices.getMyProfileFromDB(userId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'My Profile Retrived Successfully',
        data: { user }
    })
}

export const authController = {
    createUser, loginUser,
    refreshToken, getMyProfile
}