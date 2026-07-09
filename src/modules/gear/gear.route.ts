import { Router } from "express";
import { gearController } from "./gear.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";

const router = Router()

router.get('/', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), gearController.getAllGears)
router.get('/:id', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), gearController.getGearById)

export const gearRouters = router