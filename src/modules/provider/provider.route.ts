import { Router } from "express";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { providerController } from "./provider.controller.js";

const router = Router()

router.post('/gear', auth(UserRole.PROVIDER), providerController.createGear)
router.get('/gear', auth(UserRole.PROVIDER), providerController.getGears)
router.patch('/gear/:id', auth(UserRole.PROVIDER, UserRole.ADMIN), providerController.updateGear)
router.delete('/gear/:id', auth(UserRole.PROVIDER, UserRole.ADMIN), providerController.deletGear)

router.get('/rentals', auth(UserRole.PROVIDER, UserRole.ADMIN), providerController.getAllRentals)
router.patch('/rentals/:id', auth(UserRole.PROVIDER, UserRole.ADMIN), providerController.updateRentalStatus)

export const providerRouters = router