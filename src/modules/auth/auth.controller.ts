import { Request, Response } from "express"
import { authServices } from "./auth.services"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status";

const createUser = async(req: Request, res: Response) => {
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

const loginUser = async(req: Request, res: Response) => {
    const payload = req.body
    console.log(payload);

    const user = await authServices.loginUserIntoDB(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User Login Successfully',
        data: { user }
    })
}

export const authController = {
    createUser, loginUser
}