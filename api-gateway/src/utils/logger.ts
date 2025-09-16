import winston from "winston";
import config from "../config";

const { combine, timestamp, printf, colorize, json } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    config.nodeEnv === 'development' ? 
      combine(colorize(), logFormat) : 
      combine(json())
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/gateway-error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/gateway-combined.log' 
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/gateway-exceptions.log' 
    })
  ]
});

// Morgan stream for HTTP request logging
const morganStream = {
  write: (message: string) => logger.info(message.trim())
};

export { logger, morganStream };