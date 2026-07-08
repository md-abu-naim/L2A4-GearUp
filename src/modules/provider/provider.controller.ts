import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse.js"
import httpStatus from "http-status";
import { providerServices } from "./provider.services.js";

const createGear = async (req: Request, res: Response) => {
    try {
        const providerId = req.user?.id
        const payload = req.body
        console.log(providerId);

        const gear = await providerServices.createGearIntoDB(payload, providerId as string)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'Gear Created Successfully',
            data: { gear }
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

const updateGear = async (req: Request, res: Response) => {
    try {
        const gearId = req.params.id
        const payload = req.body

        const gear = await providerServices.updateGearIntoDB(payload, gearId as string)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Gear Updated Successfully',
            data: { gear }
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

export const gearController = {
    createGear, updateGear
}