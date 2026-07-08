import { Router } from "express";
import { categroyController } from "./category.controller.js";

const router = Router()

router.post('/', categroyController.createCategory)
router.get('/', categroyController.getAllCategories)
router.get('/:id', categroyController.updateCategory)
router.delete('/:id', categroyController.deleteCategory)

export const categoryRouters = router