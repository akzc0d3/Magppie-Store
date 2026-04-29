import { pinoHttp } from "pino-http";
import logger from "../utils/logger.js";

export default pinoHttp({logger})