import { redisClient } from "../config/index.js"


export const invalidateCache = () => {
    redisClient.flushall('ASYNC');
}