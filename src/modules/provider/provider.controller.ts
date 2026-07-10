import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse.js"
import httpStatus from "http-status";
import { providerServices } from "./provider.services.js";

const createGear = async (req: Request, res: Response) => {
    try {
        const providerId = req.user?.id
        const payload = req.body

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

const deletGear = async (req: Request, res: Response) => {
    try {
        const gearId = req.params.id

        const gear = await providerServices.deleteGearFromDB(gearId as string)

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


const getAllRentals = async (req: Request, res: Response) => {
    try {

        const rentals = await providerServices.getAllRentalsFromDB()

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

const updateRentalStatus = async (req: Request, res: Response) => {
    try {
        const rentalId = req.params.id
        const providerId = req.user?.id
        const payload = req.body

        const rental = await providerServices.updateRentalStatusFromDB(rentalId as string, providerId as string, payload)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Rental Order Status Updated Successfully',
            data: { rental }
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

export const providerController = {
    createGear, updateGear, deletGear,
    getAllRentals, updateRentalStatus
}