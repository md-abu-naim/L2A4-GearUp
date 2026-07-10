import { Router } from "express";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { rentalController } from "./rental.controller.js";

const router = Router()

router.post('/', auth(UserRole.CUSTOMER), rentalController.createRental)
router.get('/', auth(UserRole.CUSTOMER), rentalController.getAllRentals)
router.get('/:id', auth(UserRole.ADMIN, UserRole.CUSTOMER), rentalController.getRentalById)

export const rentalRouters = router