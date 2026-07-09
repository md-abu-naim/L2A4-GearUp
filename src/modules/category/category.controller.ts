import { Request, Response } from "express";
import { categoryServices } from "./category.services.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status";

// const createCategory = async (req: Request, res: Response) => {
//     try {
//         const payload = req.body

//         const category = await categoryServices.createCategoryIntoDB(payload)

//         sendResponse(res, {
//             success: true,
//             statusCode: httpStatus.CREATED,
//             message: 'Category Created Successfully',
//             data: { category }
//         })
//     } catch (error: any) {
//         sendResponse(res, {
//             statusCode: 500,
//             success: false,
//             message: error.message,
//             error: error
//         })
//     }
// }

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

// const updateCategory = async (req: Request, res: Response) => {
//     try {
//         const categoryId = req.params.id
//         const payload = req.body

//         const category = await categoryServices.updateCategoryIntoDB(categoryId as string, payload)

//         sendResponse(res, {
//             success: true,
//             statusCode: httpStatus.OK,
//             message: 'Category Updated Successfully',
//             data: { category }
//         })

//     } catch (error: any) {
//         sendResponse(res, {
//             statusCode: 500,
//             success: false,
//             message: error.message,
//             error: error
//         })
//     }
// }

// const deleteCategory = async (req: Request, res: Response) => {
//     try {
//         const categoryId = req.params.id

//         const category = await categoryServices.deleteCategoryFromDB(categoryId as string)

//         sendResponse(res, {
//             success: true,
//             statusCode: httpStatus.OK,
//             message: 'Category Deleted Successfully',
//             data: { category }
//         })

//     } catch (error: any) {
//         sendResponse(res, {
//             statusCode: 500,
//             success: false,
//             message: error.message,
//             error: error
//         })
//     }
// }

export const categroyController = {
    // createCategory, getAllCategories,
    // updateCategory, deleteCategory
    getAllCategories
} 