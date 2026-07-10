import { Router } from "express";
import { categroyController } from "./category.controller.js";

const router = Router()

router.get('/', categroyController.getAllCategories)

export const categoryRouters = router