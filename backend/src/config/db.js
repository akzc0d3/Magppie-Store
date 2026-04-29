import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const connectDB = async (uri) => {
    try {
        logger.info("MongoDB connecting...");
        await mongoose.connect(uri);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error(error)
        process.exit(1);
    }

}