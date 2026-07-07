import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router()

router.get('/users', auth(UserRole.ADMIN), adminController.getAllUsers)

router.patch('/users/:id', auth(UserRole.ADMIN), adminController.updateUser)

export const adminRouters = router