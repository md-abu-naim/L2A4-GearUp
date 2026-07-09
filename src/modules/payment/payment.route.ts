import { Router } from "express";
import { paymentController } from "./payment.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";

const router = Router()

router.post("/create", auth(UserRole.CUSTOMER), paymentController.createPayment)
// router.post("/confirm", paymentController.confirmPayment);

export const paymentRouters = router