import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import AppError from '../utils/app-error.js';

export default function verifyToken(options) {
    return (req, res, next) => {

        const accessToken = req.get('authorization').split(" ")[1]
        
        try {

            const decoded = jwt.verify(accessToken, env.jwtSecret, { ...options })
            req.user = decoded


            next();

        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new AppError({
                    statusCode: 401,
                    message: "Your access token expired",
                    data: null
                });
            } else if (error.name === 'JsonWebTokenError') {
                throw new AppError({
                    statusCode: 500,
                    message: "Invalid Token",
                    data: null
                });

            } else {
                logger.error(error)
                throw new AppError({
                    statusCode: 500,
                    message: "Unknown JWT error",
                    data: null
                });
            }
        }

    }
}

