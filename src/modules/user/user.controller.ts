import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse.js"
import { userService } from "./user.services.js"
import httpStatus from "http-status";

const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const payload = req.body

        const user = await userService.updateUserProfileIntoDB(payload, userId as string)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: false,
            message: "User Updated Successfully",
            data: {user}
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

export const userController = {
    updateUserProfile
}