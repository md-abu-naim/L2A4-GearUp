import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse.js"
import httpStatus from "http-status";
import { PaymentService } from "./payment.services.js";

const createPayment = async (req: Request, res: Response) => {
    try {
        const rentalOrderId = req.body.rentalOrderId
        const customerId = req.user?.id

        const payment = await PaymentService.createPaymentSession(rentalOrderId as string, customerId as string)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Stripe checkout session created successfully",
            data: {payment},
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

export const paymentController = {
    createPayment
}