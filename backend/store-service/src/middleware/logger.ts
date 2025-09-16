import winston from "winston";
import path from "path";

const rootLogDir = path.join(__dirname, "../../logs");

// Create a logger
export default winston.createLogger({
  level: "info", // Minimum log level to display
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: path.join(rootLogDir, "api.log"), maxFiles: 14 }), // Log to a file
  ],
});
