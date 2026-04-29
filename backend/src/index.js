import { env, connectRedis, connectDB } from './config/index.js'
import logger from './utils/logger.js'
import app from './app.js'





const run = async () => {

    await connectDB(env.mongoUri)
    await connectRedis(env.redisUri)

    app.listen(env.port, () => {
        logger.info(`Server running on port ${env.port}`)
    })


    process.on('SIGINT', async () => {
        logger.info('[SIGINT] ');
        process.exit(0);
    });
}


run()