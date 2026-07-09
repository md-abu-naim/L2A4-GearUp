import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse.js"
import httpStatus from "http-status";
import { rentalServices } from "./rental.services.js";

const createRental = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.id
        const payload = req.body

        const rental = await rentalServices.createRentalIntoDB(payload, customerId as string)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: 'Rental Created Successfully',
            data: { rental }
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
        const customerId = req.user?.id
        
        const rentals = await rentalServices.getAllRentalsFromDB(customerId as string)

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

export const rentalController = {
    createRental, getAllRentals
}