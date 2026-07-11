import Stripe from "stripe"
import config from "../../config/index.js"
import { prisma } from "../../lib/prisma.js"
import stripe from "../../lib/stripe.js"
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums.js"

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

const confirmPayment = async (event: Stripe.Event) => {

    if (event.type !== "checkout.session.completed") {
        return;
    }

    const session = event.data.object as Stripe.Checkout.Session;

    const rentalOrderId = session.metadata?.rentalOrderId;
    const customerId = session.metadata?.customerId;

    if (!rentalOrderId || !customerId) {
        throw new Error("Metadata missing");
    }

    const paymentExists = await prisma.payment.findUnique({
        where: {
            rentalOrderId,
        },
    });

    if (paymentExists) {
        return;
    }

    await prisma.$transaction(async (tx) => {

        await tx.payment.create({
            data: {
                rentalOrderId,
                customerId,
                amount: (session.amount_total ?? 0) / 100,
                transactionId: session.payment_intent?.toString(),
                status: PaymentStatus.COMPLETED,
            },
        });

        await tx.rentalOrder.update({
            where: {
                id: rentalOrderId,
            },
            data: {
                status: RentalStatus.PAID,
            },
        });

    });

    return;
};

const getMyPaymentsHistoryFromDB = async (customerId: string) => {
    // const payments = await prisma.payment.findMany({
    //     where: {
    //         customerId,
    //     },
    //     include: {
    //         rentalOrder: {
    //             customerId: true,
    //             gearItemId: true,
    //             quantity: true,
    //             startDate: true,
    //             endDate: true,
    //             totalPrice: true,
    //             status: true,
    //             include: {
    //                 gearItem: {
    //                     select: {
    //                         title: true,
    //                         description: true,
    //                         brand: true,
    //                         pricePerDay: true,
    //                         image: true,
    //                         category: true,
    //                         providerId: true
    //                     }
    //                 },
    //             },
    //         },
    //     },
    //     orderBy: {
    //         createdAt: "desc",
    //     },
    // })

    const payments = await prisma.payment.findMany({
        where: {
            customerId,
        },
        select: {
            id: true,
            amount: true,
            status: true,
            transactionId: true,
            rentalOrderId: true,
            customerId: true,
            createdAt: true,
            updatedAt: true,

            rentalOrder: {
                select: {
                    customerId: true,
                    gearItemId: true,
                    quantity: true,
                    startDate: true,
                    endDate: true,
                    totalPrice: true,
                    status: true,

                    gearItem: {
                        select: {
                            title: true,
                            description: true,
                            brand: true,
                            pricePerDay: true,
                            image: true,
                            category: true,
                            providerId: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return payments
}

const getMyPaymentHistoryByIdFromDB = async (paymentId: string) => {
    const payments = await prisma.payment.findUnique({
        where: {
            id: paymentId,
        },
        select: {
            id: true,
            amount: true,
            status: true,
            transactionId: true,
            rentalOrderId: true,
            customerId: true,
            createdAt: true,
            updatedAt: true,

            rentalOrder: {
                select: {
                    customerId: true,
                    gearItemId: true,
                    quantity: true,
                    startDate: true,
                    endDate: true,
                    totalPrice: true,
                    status: true,

                    gearItem: {
                        select: {
                            title: true,
                            description: true,
                            brand: true,
                            pricePerDay: true,
                            image: true,
                            category: true,
                            providerId: true,
                        },
                    },
                },
            },
        },
    })

    return payments
}

export const PaymentService = {
    createPaymentSession, confirmPayment,
    getMyPaymentsHistoryFromDB,
    getMyPaymentHistoryByIdFromDB
}