import { Router } from "express";
import { categroyController } from "./category.controller.js";

const router = Router()

router.post('/', categroyController.createCategory)

export const categoryRouters = router