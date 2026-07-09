import { Router } from "express";
import auth from "../../middleware/auth.js";
import { UserRole } from "../../../generated/prisma/enums.js";
import { rentalController } from "./rental.controller.js";

const router = Router()

router.post('/', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), rentalController.createRental)
router.get('/', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), rentalController.getAllRentals)
router.get('/:id', auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER), rentalController.getRentalById)

export const rentalRouters = router