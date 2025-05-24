import crypto from 'node:crypto';
import createHttpError from "http-errors";
import bcrypt from 'bcrypt';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';


export const registerUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (user !== null) {
        throw createHttpError.Conflict('Email in use');
    }
    payload.password = await bcrypt.hash(payload.password, 10); 
    return User.create(payload);
};

export const loginUser = async (email, password) => {
    const userData = await User.findOne({ email });
    if (userData === null) {
        throw createHttpError.Unauthorized('Email or password is incorrect');
    }
    const isMatch = await bcrypt.compare(password, userData.password);
    if (isMatch !== true) {
        throw createHttpError.Unauthorized('Email or password is incorrect');
    }

    await Session.deleteOne({ userId: userData._id });
    return Session.create({
        userId: userData._id,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 30 * 1000)
    });
};

export const refreshSession = async (sessionId, refreshToken) => {
    const currentSession = await Session.findOne({ _id: sessionId, refreshToken });

    if (currentSession === null) {
        throw createHttpError.Unauthorized('Session not found');
    }
    if (currentSession.refreshTokenValidUntil < new Date()) {
        throw createHttpError.Unauthorized('Refresh token is expired');
    }
    await Session.deleteOne({
        _id: currentSession._id,
        refreshToken: currentSession.refreshToken
    });
    return Session.create({
        userId: currentSession.userId,
        accessToken: crypto.randomBytes(30).toString('base64'),
        refreshToken: crypto.randomBytes(30).toString('base64'),
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
};

export const logOutUser = async (sessionId, refreshToken) => {
    await Session.deleteOne({ _id: sessionId, refreshToken });
    return undefined;
};