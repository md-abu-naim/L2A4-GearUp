import { RentalStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

const createReviewIntoDB = async (customerId: string, payload: { gearItemId: string, rating: number, comment: string }) => {
    const gear = await prisma.gearItem.findUnique({
        where: {
            id: payload.gearItemId,
        },
    });

    if (!gear) {
        throw new Error("Gear not found");
    }

    const rental = await prisma.rentalOrder.findFirst({
        where: {
            customerId,
            gearItemId: payload.gearItemId,
            status: RentalStatus.RETURNED,
        },
    });

    if (!rental) {
        throw new Error("You can review only after returning the gear")
    }

    const review = await prisma.review.create({
        data: {
            customerId,
            ...payload
        },
        include: {
            gearItem: true,
            user: {
                omit: {
                    password: true
                }
            },
        },
    });

    return review
}

// const getAllReviewsFromDB = async () => {
//   const reviews = await prisma.review.findMany({
//     take: 3,
//     include: {
//       user: true,
//       gearItem: true,
//     },
//   });

//   return reviews;
// };

const getAllReviewsFromDB = async () => {
  const reviews = await prisma.review.findMany({
    take: 3,
    include: {
        user: {
            select: {
                name: true,
                profileImage: true,
                role: true
            }
        },
        gearItem: {
            select: {
                title: true
            }
        }
    }
  });

  return reviews;
};

export const reviewServices = {
    createReviewIntoDB, getAllReviewsFromDB
}