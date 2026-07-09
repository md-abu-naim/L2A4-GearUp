import { Router } from "express";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { providerController } from "./provider.controller.js";

const router = Router()

router.post('/gear', auth(UserRole.PROVIDER), providerController.createGear)
router.patch('/gear/:id', auth(UserRole.PROVIDER), providerController.updateGear)
router.delete('/gear/:id', auth(UserRole.PROVIDER), providerController.deletGear)

export const providerRouters = router