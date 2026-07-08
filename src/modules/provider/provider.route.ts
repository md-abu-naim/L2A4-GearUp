import { Router } from "express";
import { gearController } from "./provider.controller.js";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";

const router = Router()

router.post('/gear', auth(UserRole.PROVIDER), gearController.createGear)
router.patch('/gear/:id', auth(UserRole.PROVIDER), gearController.updateGear)

export const providerRouters = router