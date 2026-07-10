import { Router } from "express";
import { gearController } from "./gear.controller.js";

const router = Router()

router.get('/', gearController.getAllGears)
router.get('/:id', gearController.getGearById)

export const gearRouters = router