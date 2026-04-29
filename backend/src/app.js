

import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io';
import cors from "cors";
import rateLimit from "express-rate-limit";
import logger from './utils/logger.js';
import cookieParser from 'cookie-parser';
import httpLogger from './middleware/httpLogger.js';
import verifyTokenSocket from './middleware/verifyTokenSocket.js';
import ApiResponse from "./utils/api-response.js";
import AppError from "./utils/app-error.js";

import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import adminRoutes from './routes/admin.routes.js'

import { env } from './config/index.js';




const app = express()
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: env.allowedOrigins?.split(",") || "*",
        credentials: true
    }
});

io.use(verifyTokenSocket)
io.on("connection", (socket) => {
    const userId = socket.user.id;

    socket.join(`user:${userId}`);

    logger.info(`User connected: ${userId}`);

    socket.on("disconnect", () => {
        logger.info(`User disconnected: ${userId}`);
    });
});

/** -------- Attatch io ---------- */
app.use((req, res, next) => {
    req.io = io;
    next();
});

/** -------- Setup middlewares ---------- */

// Rate-limit
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
}));

// TODO Catch non route errors like happening in ratelimit, pino http logger

// HTTP logger
app.use(httpLogger)

//  Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded())
app.use(cookieParser())

// CORS config
app.use(
    cors({
        origin: env.allowedOrigins?.split(",") || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);


/** -------- Setup routes ---------- */

app.use("/v1/auth", authRoutes);
app.use("/v1/product", productRoutes);
app.use("/v1/order", orderRoutes);
app.use("/v1/admin", adminRoutes);





/** -------- Global error handler ---------- */
app.use((error, req, res, next) => {

    logger.error(error)

    if (error instanceof AppError) {
        return ApiResponse.send(res, {
            statusCode: error.statusCode,
            message: error.message,
            data: error.data
        });
    } else {
        return ApiResponse.send(
            res, {
            statusCode: 500,
            message: "Internal Server Error",
            data: null
        }
        )
    }


});


export default server;