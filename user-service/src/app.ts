import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
import CustomError from "./utils/customError";
import errorHandler from "./middleware/errorHandler";
import userRoute from "./routes/userRoute";
import addressRoute from "./routes/addressRoute";
import customerRoute from "./routes/customerRoute";
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

// Apply routes before error handling
app.use(`${config.appConstant.VERSION_ENDPOINT}/user`, userRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/address`, addressRoute);
app.use(`${config.appConstant.VERSION_ENDPOINT}/customer`, customerRoute);

app.use(APIRatelimit);

// Apply error handling last
app.use("*", (req: Request, res: Response, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404, "NotFound"));
});
app.use(errorHandler);

if (require.main === module) {
  const port = 3002;
  app.listen(port, () => {
    console.log(`User Service running on port ${port}`);
  });
}
export default app;
