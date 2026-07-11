import { Router } from "express";
import { adminController } from "./admin.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";

const router = Router()

router.get('/users', auth(UserRole.ADMIN), adminController.getAllUsers)
router.patch('/users/:id', auth(UserRole.ADMIN), adminController.updateUser)

router.get('/gear', auth(UserRole.ADMIN), adminController.getAllUsers)

router.get('/rentals', auth(UserRole.ADMIN), adminController.getAllRentals)

router.post('/categories', auth(UserRole.ADMIN), adminController.createCategory)
router.patch('/categories/:id', auth(UserRole.ADMIN), adminController.updateCategory)
router.delete('/categories/:id', auth(UserRole.ADMIN), adminController.deleteCategory)


export const adminRouters = router