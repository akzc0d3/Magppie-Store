import express from "express";
import { login, refresh, signup } from "../controllers/auth.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import {validate, signupSchema, authSchema, loginSchema, refreshTokenSchema } from "../middleware/validator.js";
const router = express.Router()



router.post('/signup',
    validate(signupSchema),
    signup
)

router.post('/login',
    validate(loginSchema),
    login
)
router.post('/refresh',
    validate(refreshTokenSchema),
    refresh
)

// TODO: Logout
// router.post('/logout',
//     validate(authSchema),
//     verifyToken(),
//     logout
// )

export default router