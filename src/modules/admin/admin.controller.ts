import { Request, Response } from "express";
import { adminServices } from "./admin.services.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await adminServices.getAllUsersFromDB()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Users Retrived Successfully',
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
            message: 'User Status Updated Successfully',
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

const getAllGears = async (req: Request, res: Response) => {
    try {

        const gears = await adminServices.getAllGearsFromDB()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Gears Retrived Successfully',
            data: { gears }
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

const getAllRentals = async (req: Request, res: Response) => {
    try {

        const rentals = await adminServices.getAllRentalsFromDB()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Rentals Order Retrived Successfully',
            data: { rentals }
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
    getAllUsers, updateUser,
    getAllGears, getAllRentals
}