import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
import CustomError from "./utils/customError";
import errorHandler from "./middleware/errorHandler";
// Import Routes
import uploadFileRoute from "./routes/uploadRoute";
import dashboardRoute from "./routes/dashboardRoute";
import sendMailRoute from "./routes/sendMailRoute";
import APIRatelimit from "./utils/exporessRateLimit";

const app = express();

// Apply most middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // @ts-ignore
    origin: config.clientOrigins[config.nodeEnv],
  })
);
app.use(helmet());
app.use(morgan("tiny"));

app.use(`${config.appConstant.VERSION_ENDPOINT}/dashboard`, dashboardRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/email`, sendMailRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/common`, uploadFileRoute);

app.use(APIRatelimit);

// Apply error handling last
app.use("*", (req: Request, res: Response, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404, "NotFound"));
});
app.use(errorHandler);


if (require.main === module) {
  const port = 3010;
  app.listen(port, () => {
    console.log(`Utility Service running on port ${port}`);
  });
}

export default app;
