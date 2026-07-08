import { Router } from "express";
import { categroyController } from "./category.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";

const router = Router()

router.post('/', auth(UserRole.ADMIN), categroyController.createCategory)
router.get('/', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), categroyController.getAllCategories)
router.patch('/:id', auth(UserRole.ADMIN), categroyController.updateCategory)
router.delete('/:id', auth(UserRole.ADMIN), categroyController.deleteCategory)

export const categoryRouters = router