import express from "express";
import { order, view, viewOrder } from "../controllers/order.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import onlyAdmin from "../middleware/onlyAdmin.js";
import { authSchema, validate } from "../middleware/validator.js";


const router = express.Router();



router.post('/',
    // validate(orderSchema) , TODO
    validate(authSchema),
    verifyToken(),

    order
)

router.get('/',
    // validate(orderSchema) , TODO
    validate(authSchema),
    verifyToken(),
    view
)

router.get('/:orderId',
    // validate(orderSchema) , TODO
    validate(authSchema),
    verifyToken(),
    viewOrder
)



export default router;