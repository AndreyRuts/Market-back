import {
    registerUser,
    loginUser,
    refreshSession,
    logOutUser,
    requestResetPassword,
    resetPassword
} from "../services/auth.js";

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);
    res.status(201).json({
        status: 200,
        message: 'Successfully registered a user!',
        data: user
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body.email, req.body.password);
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil
    });
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil
    });
    res.status(200).json({
        res: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken
        }
    });
};

export const refreshController = async (req, res) => {
    const { sessionId, refreshToken } = req.cookies;
    const session = await refreshSession(sessionId, refreshToken);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil
    });
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil
    });
    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken
        }
    });
};

export const logoutController = async (req, res) => {
    const { sessionId, refreshToken } = req.cookies;

    if (typeof sessionId === 'string' && typeof refreshToken === 'string') {
        await logOutUser(sessionId, refreshToken);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');
    res.status(204).end();
};

export const requestPasswordResetController = async (req, res) => {
    const { email } = req.body;

    await requestResetPassword(email);

    res.json({
        status: 200,
        message: "Reset password email has been successfully sent.",
        data: {}
    });
};

export const resetPasswordController = async (req, res) => {
    const { token, password } = req.body;

    await resetPassword(token, password);

    res.json({
        status: 200,
        message: "Password has been successfully reset.",
        data: {}
    });
 };