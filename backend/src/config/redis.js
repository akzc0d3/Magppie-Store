
import Redis from 'ioredis';
import logger from '../utils/logger.js'

let redisClient;

const connectRedis = (uri) => {
    logger.info('Redis connecting...')
    redisClient = new Redis(uri, {
        maxRetriesPerRequest: null,
        enableOfflineQueue: true,
    });

    redisClient.on('connect', () => logger.info('Redis connected successfully'));
    redisClient.on('error', (err) => {
        logger.error('Redis connection error:', err);
        process.exit(1);
    });
    redisClient.on('close', () => logger.warn('Redis connection closed'));
    redisClient.on('reconnecting', (time) =>
        logger.info(`Redis reconnecting in ${time}ms`)
    );
};

export { connectRedis, redisClient };