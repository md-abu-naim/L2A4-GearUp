import { Router } from "express";
import { gearController } from "./gear.controller.js";

const router = Router()

router.get('/', gearController.getAllGears)

export const gearRouters = router