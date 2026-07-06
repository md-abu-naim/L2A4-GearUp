import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";

const router = Router()

router.post('/register', authController.createUser)
router.post('/login', authController.loginUser)
router.post('/refresh-token', authController.refreshToken)

router.get('/me', auth, authController.getMyProfile)

export const authRouters = router