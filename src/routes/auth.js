import express from 'express';

import {
    registerUserController,
    loginUserController,
    refreshController,
    logoutController,
    requestPasswordResetController,
    resetPasswordController
} from '../controllers/auth.js';

import {
    registerSchema,
    loginSchema,
    requestPasswordResetSchema,
    resetPasswordSchema
} from '../validation/auth.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';


const authRouter = express.Router();

authRouter.post(
    '/register',
    validateBody(registerSchema),
    ctrlWrapper(registerUserController),
);
authRouter.post(
    '/login',
    validateBody(loginSchema),
    ctrlWrapper(loginUserController)
);
authRouter.post('/refresh', ctrlWrapper(refreshController));
authRouter.post('/logout', ctrlWrapper(logoutController));
authRouter.post(
    '/send-reset-email',
    validateBody(requestPasswordResetSchema),
    ctrlWrapper(requestPasswordResetController)
);
authRouter.post(
    '/reset-password',
    validateBody(resetPasswordSchema),
    ctrlWrapper(resetPasswordController)
);

export default authRouter;