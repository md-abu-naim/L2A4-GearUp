import config from "../../config/index.js"
import { prisma } from "../../lib/prisma.js"
import stripe from "../../lib/stripe.js"

const createPaymentSession = async (rentalOrderId: string, customerId: string) => {
    const rental = await prisma.rentalOrder.findUnique({
        where: {
            id: rentalOrderId
        }
    })

    if (!rental) {
        throw new Error("Rental not found")
    }

    if (rental.customerId !== customerId) {
        throw new Error("You are not authorized")
    }


    if (rental.status !== "CONFIRMED") {
        throw new Error("Rental is not confirmed")
    }

    const payment = await prisma.payment.findUnique({
        where: {
            rentalOrderId
        }
    })

    if (payment) {
        throw new Error("Payment already completed")
    }

    const customer = await prisma.user.findUnique({
        where: {
            id: customerId,
        },
    });

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customer?.email,

        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: "Gear Rental Payment",
                        description: `Rental ID : ${rental.id}`,
                    },
                    unit_amount: Math.round(rental.totalPrice * 100),
                },
                quantity: rental.quantity,
            },
        ],

        metadata: {
            rentalOrderId: rental.id,
            customerId,
        },


        success_url: `${config.app_url}/payment-success?rentalId=${rental.id}`,
        cancel_url: `${config.app_url}/payment-cancel`,
    });

    return {
        checkoutUrl: session.url,
        sessionId: session.id,
    };

}

export const PaymentService = {
    createPaymentSession
}