import { Router } from "express";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { userController } from "./user.controller.js";

const router = Router()

router.patch('/profile', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), userController.updateUserProfile)

export const userRouters = router