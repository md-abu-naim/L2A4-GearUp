import { Router } from "express";
import { adminController } from "./admin.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";

const router = Router()

router.get('/users', auth(UserRole.ADMIN), adminController.getAllUsers)

router.patch('/users/:id', auth(UserRole.ADMIN), adminController.updateUser)

export const adminRouters = router