import { Router } from 'express';

import {
    createOrderController,
    getOwnOrdersController
} from '../controllers/orders.js';

import { orderCreateValidationSchema } from '../validation/order.js';

import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const ordersRouter = Router();

ordersRouter.use(authenticate);

ordersRouter.post(
  '/',
  validateBody(orderCreateValidationSchema),
  ctrlWrapper(createOrderController)
);
ordersRouter.get('/', ctrlWrapper(getOwnOrdersController));

export default ordersRouter;
