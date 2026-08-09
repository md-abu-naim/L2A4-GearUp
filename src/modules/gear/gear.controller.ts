import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse.js"
import httpStatus from "http-status";
import { gearServices } from "./gear.services.js";

const getAllGears = async (req: Request, res: Response) => {
    try {
        const query = req.query

        const gears = await gearServices.getAllGearsFromDB(query)

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

const getFeaturedGear = async(req: Request, res: Response) =>{
    try {

        const gear = await gearServices.getFeaturedGearFromDB()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Featured Gear Retrived Successfully',
            data:  gear 
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

const getPopularGear = async(req: Request, res: Response) =>{
    try {

        const gear = await gearServices.getPopularGearFromDB()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Popular Gear Retrived Successfully',
            data:  gear 
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

const getGearById = async (req: Request, res: Response) => {
    try {
        const gearId = req.params.id

        const gear = await gearServices.getGearByIdFromDB(gearId as string)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'A Gear Retrived Successfully',
            data: { gear }
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
    getAllGears, getGearById,
     getFeaturedGear, getPopularGear
}