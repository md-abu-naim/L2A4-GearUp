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
            message: 'Category Created Successfully',
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

const getAllCategories = async (req: Request, res: Response) => {

    const categories = await categoryServices.getAllCategoriesFromDB()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Categories Retrived Successfully',
        data: { categories }
    })
}

export const categroyController = {
    createCategory, getAllCategories
} 