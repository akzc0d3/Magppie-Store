import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';

export default function (socket, next) {

    try {

        const accessToken = socket.handshake.auth.token;

        const decoded = jwt.verify(accessToken, env.jwtSecret);

        socket.user = decoded;
        next();
    } catch (e) {
        const error = new Error();
        if (e.name === "TokenExpiredError") {
            error.message = 'Authentication failed'
            error.data = { reason: 'Token expired', code: 401 }
        } else if (e.name === 'JsonWebTokenError') {
            error.message = 'Authentication failed'
            error.data = { reason: 'Invalid token', code: 401 }
        } else {
            logger.error(e)
            error.message = 'Authentication failed'
            error.data = { reason: 'Unknown JWT error', code: 401 }
        }
        next(e);
    }
};
