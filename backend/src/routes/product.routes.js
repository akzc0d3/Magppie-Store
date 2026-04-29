import express from 'express'
import verifyToken from '../middleware/verifyToken.js';
import {search, update, create, remove} from '../controllers/product.controller.js'
import cache from '../middleware/caching.js';
import onlyAdmin from '../middleware/verifyToken.js';
import { authSchema, validate } from "../middleware/validator.js";


const router = express.Router();


router.post('/create',
    validate(authSchema),
    // validate(createSchema), TODO
    verifyToken(),
    onlyAdmin,
    create
)

router.get('/search',
    // validate(searchSchema), TODO
    cache,
    search
)

router.patch('/update',
    validate(authSchema),
    // validate(updateSchema), TODO
    verifyToken(),
    onlyAdmin,
    update
)


router.delete('/remove',
    validate(authSchema),
    // validate(removeSchema), TODO
    verifyToken(),
    onlyAdmin,
    remove
)
export default router