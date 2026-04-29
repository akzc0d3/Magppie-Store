import dotenv from "dotenv";

const env = {NODE_ENV:process.env.NODE_ENV}

switch (env.NODE_ENV) {
    case 'development':
        dotenv.config({ path: '.env.development' });

}

env.port =  process.env.PORT,
env.mongoUri =  process.env.MONGO_URI,
env.redisUri =  process.env.REDIS_URI,
env.encryptionKey =  process.env.ENCRYPTION_KEY,
env.jwtSecret =  process.env.JWT_SECRET,
env.allowedOrigins =  process.env.ALLOWED_ORIGINS,
env.accessTokenTTL =  Number(process.env.ACCESS_TOKEN_TTL ?? 600)
env.refreshTokenTTL =  Number(process.env.REFRESH_TOKEN_TTL ?? 86400)
env.cacheTTL =  Number(process.env.CACHE_TTL ?? 60)

export default env;