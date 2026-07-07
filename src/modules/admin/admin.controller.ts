import { Request, Response } from "express";
import { adminServices } from "./admin.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await adminServices.getAllUsersFromDB()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'My Profile Retrived Successfully',
            data: { users }
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

const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const payload = req.body

        const user = await adminServices.updateUserFromDB(userId as string, payload)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'User Updated Successfully',
            data: { user }
        })

    } catch (error: any) {
        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
            error: error
        })
    }
}

export const adminController = {
    getAllUsers, updateUser
}