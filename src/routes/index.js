import express from 'express';

import authRouter from './auth.js';
import goodsRouter from './goods.js';
import ownGoodsRouter from './ownGoods.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/goods', goodsRouter);
rootRouter.use('/own/goods', ownGoodsRouter);

export default rootRouter;

