import { Router } from "express";
import { adminController } from "./admin.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";

const router = Router()

router.get('/users', auth(UserRole.ADMIN), adminController.getAllUsers)
router.patch('/users/:id', auth(UserRole.ADMIN), adminController.updateUser)

router.get('/gear', auth(UserRole.ADMIN), adminController.getAllUsers)

router.get('/rentals', auth(UserRole.ADMIN), adminController.getAllRentals)

export const adminRouters = router