import express from 'express';

import authRouter from './auth.js';
import goodsRouter from './goods.js';

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/goods', goodsRouter);

export default rootRouter;

