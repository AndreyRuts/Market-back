import createHttpError from "http-errors";

import { User } from "../models/user.js";
import { Session } from "../models/session.js";

export const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    
    if (typeof authorization !== 'string') {
        return next(createHttpError.Unauthorized('Please provide access token'));
    }

    const [bearer, accessToken] = authorization.split(' ', 2);
    if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
        return next(createHttpError.Unauthorized('Please provide access token'));
    }

    const session = await Session.findOne({ accessToken });
    if (!session) {
        return next(createHttpError.Unauthorized('Session not found'));
    }
    if (session.accessTokenValidUntil < new Date()) {
        return next(createHttpError.Unauthorized('Access token expired'));
    }

    const user = await User.findById(session.userId);
    if (!user) {
        return next(createHttpError.Unauthorized('User not found'));
    }
    req.user = { id: String(user._id), name: user.name };
    next();
};