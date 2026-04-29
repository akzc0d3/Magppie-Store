import express from "express";
import { orders, update, viewOrder } from "../controllers/admin.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import onlyAdmin from "../middleware/onlyAdmin.js";
import { authSchema, validate } from "../middleware/validator.js";

const router = express.Router()

router.use(
    validate(authSchema),
    verifyToken(),
    onlyAdmin
)

router.get('/orders', orders)
router.patch('/orders/:orderId/:status', update)

router.get('/orders/:orderId',viewOrder)



export default router