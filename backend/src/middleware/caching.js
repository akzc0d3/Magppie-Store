import { redisClient } from '../config/redis.js';
import { env } from '../config/index.js';
import ApiResponse from '../utils/api-response.js';

export default async (req, res, next) => {


    const key = generateCacheKey(req);

    try {
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            return ApiResponse.send(res, JSON.parse(cachedData), {
                headers:  
                    {
                       "X-cache":'HIT',
                        
                    },  
            })
        }

        res.locals.cacheKey = key;

        next();
    } catch (err) {
        next();
    }

}

const generateCacheKey = (req) => {
    return `cache:products:${JSON.stringify({
        query: req.query,
        params: req.params,
    })}`;
};