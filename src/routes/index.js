import express from 'express';

// import { authenticate } from '../middlewares/authenticate.js';

import authRouter from './auth.js';

const rootRouter = express.Router();

// rootRouter.use('/market');
rootRouter.use('/auth', authRouter);

export default rootRouter;

