import { Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse.js"
import httpStatus from "http-status";
import { PaymentService } from "./payment.services.js";
import stripe from "../../lib/stripe.js";
import config from "../../config/index.js";

const createPayment = async (req: Request, res: Response) => {
    try {
        const rentalOrderId = req.body.rentalOrderId
        const customerId = req.user?.id

        const payment = await PaymentService.createPaymentSession(rentalOrderId as string, customerId as string)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Stripe checkout session created successfully",
            data: { payment },
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

const confirmPayment = async (req: Request, res: Response) => {
    try {
        const signature = req.headers["stripe-signature"] as string;

        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            config.stripe_webhook_secret
        );

        await PaymentService.confirmPayment(event);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Payment Confirmed successfully",
            data: null
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

const getMyPaymentsHistory = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.id

        const payments = await PaymentService.getMyPaymentsHistoryFromDB(customerId as string)

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Payments History Retrived Successfully",
            data: {payments}
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

const getMyPaymentsHistoryById = async (req: Request, res: Response) => {
    try {
        const paymentId = req.params.id

        const payment = await PaymentService.getMyPaymentHistoryByIdFromDB(paymentId as string)

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Payment History Retrived Successfully",
            data: {payment}
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

export const paymentController = {
    createPayment, confirmPayment,
    getMyPaymentsHistory,
    getMyPaymentsHistoryById
}