import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";

const router = Router()

router.post("/create", auth(UserRole.CUSTOMER), paymentController.createPayment)
router.post("/confirm", paymentController.confirmPayment);
router.get('/', auth(UserRole.CUSTOMER), paymentController.getMyPaymentsHistory)
router.get('/:id', auth(UserRole.CUSTOMER, UserRole.ADMIN), paymentController.getMyPaymentsHistoryById)

export const paymentRouters = router