import {
    registerUser,
    loginUser
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