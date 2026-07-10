import { Request, Response } from "express";
import { categoryServices } from "./category.services.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryServices.getAllCategoriesFromDB()

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Categories Retrived Successfully',
            data: { categories }
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
    getAllCategories
} 