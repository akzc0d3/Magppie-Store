import { pinoHttp } from 'pino-http';
import { env } from '../config/index.js'
import pino from 'pino';



const logger = pino(
    env.NODE_ENV !== 'production' ?
        {
            level: 'trace',
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                },
            },
        } :
        {
            level: 'info'
        }
);


export default logger