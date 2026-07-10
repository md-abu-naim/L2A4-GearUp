import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse.js"
import httpStatus from "http-status";
import { reviewServices } from "./review.service.js";

const createReview = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.id
        const payload = req.body

        const review = await reviewServices.createReviewIntoDB(customerId as string, payload)

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: "Review created successfully",
            data: { review },
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
            error: error
        })
    }
}

export const reviewController = {
    createReview
} 