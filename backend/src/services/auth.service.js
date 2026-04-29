import { env } from "../config/index.js";
import argon2 from "argon2";
import AppError from "../utils/app-error.js";
import User from "../models/user.model.js";
import RefreshToken from "../models/refresh-token.model.js";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import logger from "../utils/logger.js";


export const signup = async (email, password, role) => {

    try {

        const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id,
        });
        const user = await User.create({
            email,
            passwordHash,
            role
        });
        return user;

    } catch (error) {
        if (error.code === 11000) {
            throw new AppError({
                statusCode: 409,
                message: "Email already exists",
                data: null

            });
        } else {

            logger.error(error)
            throw new AppError({
                statusCode: 500,
                message: "Internal Error: Unable to insert [Auth]",
                data: null
            });
        }


    }
};


export const login = async (email, password) => {


    const user = await User.findOne({ email }).select('+passwordHash')

    if (!user) {
        throw new AppError({
            statusCode: 401,
            message: "The login information you entered is incorrect.",
            data: null

        });
    }

    const isValid = await argon2.verify(user.passwordHash, password)

    if (isValid) {
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user)


        return {
            user,
            accessToken,
            refreshToken
        };

    } else {
        throw new AppError({
            statusCode: 401,
            message: "The login information you entered is incorrect.",
            data: null
        });
    }


};


export const refresh = async (rt) => {

    const tokenHash = crypto.createHash('sha256').update(rt).digest('hex');

    const refreshTokenDoc = await RefreshToken.findOne({ tokenHash }).populate('userId')
    if (!refreshTokenDoc) {
        throw new AppError({
            statusCode: 400,
            message: "Your refresh token has expired.",
            data: null
        });
    }
    const user = refreshTokenDoc.userId

    // Rotate token
    await refreshTokenDoc.deleteOne()


    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user)

    return {
        user,
        accessToken,
        refreshToken
    };

};


async function generateAccessTokenAndRefreshToken(user) {
    const { jwtSecret, accessTokenTTL, refreshTokenTTL } = env

    const accessToken = generateAccessToken(user, jwtSecret, accessTokenTTL)
    const refreshToken = generateRefreshToken()

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Save Refresh token
    await RefreshToken.create({
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + refreshTokenTTL * 1000)
    })


    return { accessToken, refreshToken }
}


function generateAccessToken(user, secret, ttl) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: ttl }
    )
}

function generateRefreshToken() {
    return crypto.randomBytes(32).toString('hex')
}