import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse.js"
import httpStatus from "http-status";
import { gearServices } from "./gear.services.js";

const getAllGears = async (req: Request, res: Response) => {
    try {

        const gears = await gearServices.getAllGearsFromDB()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'Category Created Successfully',
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

export const gearController = {
    getAllGears
}