import { Request, Response } from "express";
import { categoryServices } from "./category.services.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";

const createCategory = async (req: Request, res: Response) => {
    try {
        const payload = req.body

        const category = await categoryServices.createCategoryIntoDB(payload)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Users Retrived Successfully',
            data: { category }
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

export const categroyController = {
    createCategory
}