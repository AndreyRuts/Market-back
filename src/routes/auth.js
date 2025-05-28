import express from 'express';

import {
    registerUserController,
    loginUserController,
    refreshController,
    logoutController,
    requestPasswordResetController,
    resetPasswordController,
    verifyUserEmailController,
    getOauthUrlController,
    confirmOAuthController
} from '../controllers/auth.js';

import {
    registerSchema,
    loginSchema,
    requestPasswordResetSchema,
    resetPasswordSchema,
    confirmOAuthSchema
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
authRouter.get('/verify-email/:token', ctrlWrapper(verifyUserEmailController));
authRouter.get('/get-oauth-url', ctrlWrapper(getOauthUrlController));
authRouter.post(
    '/confirm-oauth',
    validateBody(confirmOAuthSchema),
    ctrlWrapper(confirmOAuthController));

export default authRouter;